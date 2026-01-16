---
title: "Mockito 없이 순수 Java 로 AOP 에 대해서 단위 테스트를 진행해보았다."
description: "Mockito나 SpringBootTest 없이 순수 Java와 Proxy를 활용하여 AOP 단위 테스트를 진행한 경험과 방법 공유"
date: 2026-01-16 09:00:00+09:00
categories:
    - Tech
tags:
    - Java
    - AOP
    - Testing
    - Unit Test
---

# Mockito 없이 순수 Java 로 AOP 에 대해서 단위 테스트를 진행해보았다.

## 개요( 概要 )

필자는 Spring Security 를 사용하지 않고, User Role 에 따라 실행될 수 있는 Method 를 분리하고 싶었다.

User Role 에 따른 실행 가능한 Method 의 분리를 생각했을 때, Controller Layer 에서 요청으로 전달받은 Token 의 분해와 해당 Token 의 Claims 에 포함되어있는 Role 을 가져와야됐다.

여기에서 도출된 내 고민은 "과연 이 Logic이 Controller Layer 에 있어야되나?" 라는 고민이었다.

검증에 관련된 로직은 Security 도메인에서 관리하게 설정하고 싶었고, 이에 따라 Annotation 으로 관리하자는 결론을 내리게 되었다.

Annotation 으로 관리를 하여서, HandlerMethodArgumentResolver 로 따로 빼내는 생각을 1차적으로 하였는데, 그렇게 할 경우, Parameter 에 무의미한 값을 가져올 가능성이 있었다.

따라서 이를 AOP 로 작성하면 관심사 분리도 될 뿐 더러, 여러 방면으로 사용될 가치가 있을 거라는 판단하에 AOP 를 작성하게 되었다.

하지만 필자는 AOP 를 처음 작성해보기도 하였고, 이때까지 AOP 를 적극적으로 이용해본 경험이 많이 없었다..😭

같이 프로젝트를 진행하는 팀원들에게 필자가 작성한 Logic 에 대해서 신뢰를 얻기 위해 Test 코드를 작성하게 되었는데, 대부분의 예제들은 Mockito 나 @SpringBootTest 를 이용하여 통합테스트로 진행하는 것을 볼 수 있었다.

이 과정은 Test 가 느려질 뿐 더러, Jobmanri 프로젝트는 JDBC Repository 를 사용하고 있어, 통합테스트를 사용하는 부분이 많아 사용하기 꺼려졌다..
( 기왕이면 최대한 필요한 부분에 대해서만 통합 테스트를 진행하고 싶은 필자의 욕심이 조금 담겨있음. )

따라서 Insight 를 찾아보던 중, 단위테스트를 통해서 Aspect 를 테스트한 문서가 있어, 해당 문서를 참고하여 테스트 코드를 작성하게 되었다.

## 내용（内容）

제목이 Mockito 없이 순수 Java 로 AOP 단위 테스트를 진행해보았다고 해놨는데, 구체적으로 SpringBootTest 또한 진행하지 않았다.

이렇게 테스트가 진행할 수 있었던 조건은 아래와 같다.

1. Bean 이나 JPA 에 의존하지 않는 기능
2. Java 에 기존 내장되어 있는 RequestContext 를 이용한 기능 탑재

해당 글을 이해하기 위해서 Jobmanri 의 @PreAuthorize 가 어떤 Flow 로 진행되는 지 알면 좋을 것 같아서 AI 를 통해서 플로우만 맛보기로 보도록 하자.
![aop-flow-diagram](https://github.com/user-attachments/assets/594911bd-5a65-401d-8dd2-bb628f31d2ac)

위에서 AOP 가 어떻게 적용되는지 알 수 있었으므로, 구체적인 로직에 들어가자.

```java
@Around("@annotation(preAuthorize)")
public Object checkRoleForAuthorize(ProceedingJoinPoint proceedingJoinPoint,
        PreAuthorize preAuthorize) throws Throwable {
    ServletRequestAttributes attrs = getRequestAttributes();

    HttpServletRequest request = attrs.getRequest();

    AuthInfo authInfo = getAuthInfo(request);

    userRoleVerification(authInfo, preAuthorize.role());

    return proceedingJoinPoint.proceed();
}
```

위의 로직을 보면, Test 코드를 작성할 때, ServletRequest 에 대해서 접근하는 부분이 있는 것을 확인할 수 있다.

그래서 해당 로직을 테스트하기 위해서는 ServletRequest 을 구현해야만하는 단점이 있었다.
아마 ServletRequest Interface 를 확인하면, 꽤나 많은 Method 를 구현해야하는 것을 알 수 있는데,,
<img width="1039" height="559" alt="image" src="https://github.com/user-attachments/assets/786b4b8e-803f-4019-bf54-5fdac0d6c3e2" />

이를 다 구현하는 것 또한 방법이겠지만, 그렇게 되면 Test 코드에 대해서 많은 시간을 투자하게 된다.. ( 기능 구현하기에도 바쁜데,,🫠 )

따라서 ServletRequest 인스턴스 역할을 하는 Proxy 객체를 아래와 같이 제작하기로 하였다.
왜냐하면 필요한 Method는 attributes 를 설정하고, 가져오는 것, 그리고 Header 에 들어있는 Authorization 을 가져오기 위함이기 때문이다.

```java
import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;

public class TestHttpRequestServlet {

    public static HttpServletRequest createFakeRequest(String token) {
        final Map<String, Object> attributes = new HashMap<>();
        final Map<String, String> headers = new HashMap<>();

        headers.put("Authorization", "Bearer " + token);

        return (HttpServletRequest) Proxy.newProxyInstance(
                TestHttpRequestServlet.class.getClassLoader(),
                new Class[]{HttpServletRequest.class},
                (proxy, method, args) -> {
                    String methodName = method.getName();

                    if (methodName.equals("getHeader")) {
                        String headerName = (String) args[0];
                        return headers.get(headerName);
                    }
                    if (methodName.equals("setAttribute")) {
                        attributes.put((String) args[0], args[1]);
                        return null;
                    }
                    if (methodName.equals("getAttribute")) {
                        return attributes.get(args[0]);
                    }
                    return null;
                }
        );
    }
}
```

이렇게 Fake Reqeust Servlet 을 만들 수 있게 되었고, 아래처럼 코드를 작성할 수 있게 되었다.

- JwtTokenProvider / JwtTokenCommandAdaptor 의 경우, 토큰을 제작하는데에 필요하여 작성.
  - 실제 Aspect 는 Request 에 들어있는 Token 유무를 판단해서 예외를 반환하기 때문이다!!

```java
@DisplayName("PreAuthorize Annotation Aspect 통합 테스트")
class PreAuthorizeAspectTest {

    private final PreAuthorizeAspect preAuthorizeAspect = new PreAuthorizeAspect();

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Nested
    @DisplayName("권한이 일치할 경우, 메서드들 실행")
    class AuthorizeSuccess {

        @Test
        @DisplayName("권한이 일치할 경우")
        void success() throws Throwable {
            // * When
            JwtTokenProvider provider = TestTokenProvider.getProvider();
            JwtTokenCommandAdaptor commandAdaptor = new JwtTokenCommandAdaptor(provider);

            Long id = 1L;
            UserRole role = UserRole.ADMIN;
            String resultMessage = "Target Method Executed";
            String token = commandAdaptor.publishToken(
                    TokenType.ACCESS, id, role);

            HttpServletRequest request = TestHttpRequestServlet.createFakeRequest(token);
            request.setAttribute(JwtUtils.CLAIMS_KEY, new AuthInfo(id, role));
            RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
            // * Aspect 로직 수행
        }
    }
}
```

추가적으로 Aspect 에 들어가는 Parameter 인 **ProceedingJoinPoint** 와 **PreAuthorize** 어노테이션을 전달해주기 위해서 이들에 대한 Fake 객체 또한 만들어줘야했다.

PreAuthorize 와 같은 어노테이션에 대해서 Fake 객체를 만들어주기 위해서는 Annotation 또한 interface 이기에, Proxy 객체로 구현체를 만들어주는  방법밖에 떠오르지 않았다. ( 이에 대해서 만약 개선점이 필요할 것 같은 기분...🫠 )

또한 ProceedingJoinPoint interface 도 구현체를 만들어줘야했기에 Proxy 로 구현체를 만들어주기로 결심하였다.

- 이 부분은 글이 길어질거라 생각하여, 코드를 참고해주시면 감사하겠습니다.

따라서 아래처럼 코드를 작성하게 되었다.
```java
// * When
PreAuthorize fakeAnnotation = FakePreAuthorize.createFakePreAuthorize("ADMIN");
ProceedingJoinPoint fakeJoinPoint = FakeJoinPoint.createFakeJoinPoint(
        () -> resultMessage);
Object result = preAuthorizeAspect.checkRoleForAuthorize(fakeJoinPoint, fakeAnnotation);

// * Then
assertThat(result).isEqualTo(resultMessage);
```

마지막으로 테스트를 실행해보았을 때, 아래처럼 성공하는 것을 볼 수 있다.

<img width="1472" height="243" alt="image" src="https://github.com/user-attachments/assets/6404d4e3-ca47-4d87-b559-5eeb40d009f6" />

여기에서 속도는 175ms 로 나와있는데, 다른 통합테스트에 비해서 속도를 비교해보면 4배정도 빠른 것을 볼 수 있다.
<img width="1472" height="243" alt="image" src="https://github.com/user-attachments/assets/0667877d-474e-46fb-b9ae-201e57d61e88" />

엄청나게 드라마틱한 변화는 아니지만, 통합테스트를 추가하지않고, 순수 Java로만 Test Code 를 작성해본 것에 대해서 의의를 두고, 이 포스팅을 마치고자 한다.

## Reference
- [🚀 AOP 단위테스트 레퍼런스입니다.](https://junhyunny.github.io/spring-boot/test-driven-development/improve-feign-client-aop-test/)
