---
title: "ThreadLocal 오염 문제를 직접 테스트해보았다"
description: "ThreadLocal 사용 시 발생할 수 있는 데이터 오염 문제를 통합 테스트로 검증하고 도입을 보류한 이유"
date: 2026-01-16 09:35:00+09:00
lang: ko
categories:
    - test
tags:
    - Java
    - ThreadLocal
    - Testing
    - Concurrency
---

# ThreadLocal 오염 문제를 직접 테스트해보았다

<img width="500" height="250" alt="Image" src="https://github.com/user-attachments/assets/2ec401dd-0ccf-48f0-b02e-4646ebbac894" />

## 개요

토큰에 대한 관리방법을 생각하면서 SpringBoot Security 를 사용하느냐, 안하냐의 차이점을 따져보았을 때, ThreadLocal 에 대한 관리 차이를 알게 되었다.
ThreadLocal 는 하나의 Thread 가 가질 수 있는 저장소로써, Security 에서는 요청이 왔을 때, 요청에 들어있는 정보에 대해서 어떤 Layer 에서도 **요청이 살아있는한** 접근을 할 수 있다.
우리의 서비스는 Security 를 달게 될 경우, 쓰지 않는 기능들이 많아져 프로젝트가 비대해지기 때문에, Security 를 도입하지않았다.
따라서 Security 에서 필요한 기능들에 대해서만 검토를 하여, jobmanri 에 적용하기로 하였다.

결론적으로 ThreadLocal 을 사용하지는 않았지만, ThreadLocal 의 특징을 볼 때, 내부 내용을 비워주지않으면 사용자 인증정보가 남아있는 오염문제가 발생할 수 있다고 생각하였다.

하지만 정말 오염이 이루어질까? 라는 궁금증이 생겨 이에 대해 테스트를 하고자 한다.

## Test 환경설정
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = "server.tomcat.threads.max=1")
```

위처럼 Controller 에 대해서 통합테스트를 진행해야되므로, SpringBootTest 를 설정해두었다.
그리고 Thread 에 대해서 오염되는지 빠르게 확인하기 위해서 tomcat의 thread 를 1로 설정해두었다.

```java
@Autowired
private TestRestTemplate restTemplate;

@TestConfiguration
static class TestRestTemplateConfiguration {
    @Bean
    public DController dController() {
        return new DController();
    }
}
```

그리고 RestTemplate 에 대해서 Test 용도로 사용해도 될까? 라는 의문을 가졌는데, 찾아보니 TestRestTemplate 이 있는 것을 확인하였다.
TestRestTemplate 은 통합테스트에 적합한 RestTemplate 인데, 이에 대한 내용은 아래의 Reference 에 적용해놓았다.

추가적으로 Controller 에 대한 내용이 Main 소스코드에 들어가면 안되는 내용이라 Test 파일 내부에 설정해놓았는데, SpringBoot Application Container 에서 Bean 으로 등록해, Adapter 로 인식할 수 있도록 Bean 또한 등록을 해주었다.

Test 환경에서는 TestConfiguration 이라는 어노테이션을 적용하는 것을 알 수 있었다!

## Test 내용

테스트 내용에 대해서는 총 2가지의 테스트를 진행하였다.

1. ThreadLocal 에 대해서 Clear 를 했을 때 ( 오염되지 않았을 때 )
2. ThreadLocal 에 대해서 Clear 를 하지 않았을 때 ( 오염되었을 때 )

### ThreadLocal 에 대해서 Clear 를 했을 때 ( 오염되지 않았을 때 )
```java
// * Thread Local 객체
package com.example.bak.auth.threadlocal;

public class AuthContext {
    private static final ThreadLocal<String> session = new ThreadLocal<>();

    public static void setToken(String token) {
        session.set(token);
    }
    public static String getToken() {
        return session.get();
    }
    public static void clear() {
        session.remove();
    }
}
```

```java
@RestController
static class DController{
  @GetMapping("/auth-test")
  public String handleTest(@RequestParam(required = false) String token){
      try{
         if(token != null){
           AuthContext.setToken(token);
         }
         return "savedToken: " + AuthContext.getToken();
      }finally{
           AuthContext.clear();
      }
  }
}
```
위는 토큰을 설정하고, 해당 요청이 처리가 끝났을 때, ThreadLocal 에 대한 내용을 지우는 Controller 이다.

이에 대해서 토큰이 없는지를 테스트를 했을 때, 테스트가 성공하는 것을 확인할 수 있었다.

[TestCode]
```java
@Test
@DisplayName("ThreadLocal 을 clear 하지 않을 경우, 이전 사용자의 Token 이 남아있는가?")
public void clearThreadLocal() {
    // given
    String userAToken = "SECRET-A";

    // when
    ResponseEntity<String> responseA = restTemplate.getForEntity("/auth-test?token=" + userAToken, String.class);

    // then
    System.out.println("User A Response: " + responseA.getBody());
    assertThat(responseA.getBody()).contains("savedToken: " + userAToken);

    // given
    ResponseEntity<String> responseB = restTemplate.getForEntity("/auth-test", String.class);

    // then
    assertThat(responseB.getBody()).isEqualTo("savedToken: null");
}
```
<img width="1512" height="949" alt="Image" src="https://github.com/user-attachments/assets/06cb3ce3-b77c-469f-886d-0e4b70d8d90e" />

### ThreadLocal 에 대해서 Clear 를 하지 않았을 때 ( 오염되었을 때 )

```java
@RestController
static class DController{
    @GetMapping("/auth-test")
    public String handleTest(@RequestParam(required = false) String token){
        if(token != null){
            AuthContext.setToken(token);
        }

        return "savedToken: " + AuthContext.getToken();
    }
}
```
위처럼 설정을 바꾼 후, ThreadLocal 에 대해서 clear 를 하지 않았을 경우를 확인해보았다.

```java
@Test
@DisplayName("ThreadLocal 을 clear 하지 않을 경우, 이전 사용자의 Token 이 남아있는가?")
public void clearThreadLocal() {
    // given
    String userAToken = "SECRET-A";

    // when
    ResponseEntity<String> responseA = restTemplate.getForEntity("/auth-test?token=" + userAToken, String.class);

    // then
    System.out.println("User A Response: " + responseA.getBody());
    assertThat(responseA.getBody()).contains("savedToken: " + userAToken);

    // given
    ResponseEntity<String> responseB = restTemplate.getForEntity("/auth-test", String.class);

    // then
    assertThat(responseB.getBody()).isEqualTo("savedToken: " + userAToken);
}
```
<img width="1512" height="949" alt="Image" src="https://github.com/user-attachments/assets/36dca4cf-e974-4f56-b583-355f2977a993" />

보이는 것과 같이 userAToken 에 대해서 남아있는 것을 확인할 수 있다!

## 결론

ThreadLocal 은 모든 Layer 에서 접근을 할 수 있기 때문에, Layer 간의 책임에 대해서 되게 모호한 경계선이 될 수 있다고 판단을 하였습니다. 
추가적으로 Security 에서는 해당 ThreadLocal 에 대해서 관리를 해주지만, 만약 제가 ( @Sunja-An  ) 이를 관리한다고 했을 때, 휴먼에러가 많이 나올 것이라고 생각하였고, 또한 지우지 않았을 경우의 위험 부담이 굉장히 크다고 생각하여 도입을 하지 않게 되었습니다.

그리고 눈으로 Thread 의 저장소가 오염이 되어있는 것을 확인하는 경험을 해보아 굉장히 값진 경험을 했다고 생각합니다 🥴

이번 Issue 에 대해서 궁금한 점과 제안해주실 부분이 있으면 댓글 남겨주시면 감사하겠습니다 😎

## Reference
- [TestRestTemplate DOCS](https://docs.spring.io/spring-boot/3.3/api/java/org/springframework/boot/test/web/client/TestRestTemplate.html)
