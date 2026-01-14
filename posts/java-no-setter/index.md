---
title: "Setter 를 쓰지 않겠다는 다짐"
description: JDBC와 JPA를 사용하며 Setter 사용에 대한 의문과 Reflection을 통한 대안 탐구
date: 2025-12-09 14:00:00+09:00
categories:
    - Tech
tags:
    - Java
    - Reflection
    - JPA
    - JDBC
    - Korean
---

# [Java] Setter 를 쓰지 않겠다는 다짐

## 개요
JDBC 를 이용해 객체를 만들어 Return 을 하는 순간, Setter 를 쓰는 것이 굉장히 마음에 안들었다.
- [https://tecoble.techcourse.co.kr/post/2020-04-28-ask-instead-of-getter/](https://tecoble.techcourse.co.kr/post/2020-04-28-ask-instead-of-getter/)

해당 글을 읽고, 객체라는 개념에 대해서 재정립을 하기 시작했는데, 과연 내가 사용하고 있는 Setter 의 방식이 옳은 것일까? 라는 의문을 가지게 된 것이다.
JDBC 를 이용해서 JPA 를 개발하진 않았겠지만, JPA 를 사용하면서 나는 Setter 를 적용해준 기억이 없었기 때문에 Setter 보다 더 좋은 방법이 있다고 생각을 하게 되어 해당 포스팅을 작성한다.

## 내용
```java
public Optional<Gift> findById(Long giftId){ 
    String sql = "SELECT * FROM Gift WHERE id = ?"; 
    Object[] params = new Object[]{giftId}; 
    int[] argsTypes = {Types.BIGINT}; 
    /* 
    * 해당 부분에서 왜 빈 생성자가 필요한지에 대해서 이해를 하게 되었다. 
    * 또한 JpaRepository Entity 들은 Setter 없이도 값들이 넣어지는게 가능하였는데, 
    * 왜 JDBC 는 이렇게 Setter 가 있어야만 하는지 궁금했다. 
    * */ 
    ResultSetExtractor<Gift> extractor = rs -> { 
        if(rs.next()) { 
            Gift gift = new Gift(); 
            gift.setGiftId(rs.getLong("id")); 
            gift.setGiftName(rs.getString("giftName")); 
            gift.setGiftPrice(rs.getInt("giftPrice")); 
            gift.setGiftPhotoUrl(rs.getString("giftPhotoUrl")); 
            return gift; 
        } 
        return null; 
    }; 
    return Optional.ofNullable(jdbcTemplate.query(sql, params, argsTypes, extractor)); 
}
```

궁금증은 위와 같은 코드에서 발생하였다.
JDBC 에서 id 에 걸맞는 객체를 가져와 해당 객체의 조건에 맞게 JdbcTemplate 을 이용해서 객체를 Optional 로 감싼 뒤, return 해주는 method 이다.
Gift 라는 엔티티에 대해서 나는 값을 넣어주기 위해서 각 필드마다 Setter 를 적용하였는데, 그 부분이 굉장히 마음에 안들었다.

```java
Gift gift = new Gift(); 
gift.setGiftId(rs.getLong("id")); 
gift.setGiftName(rs.getString("giftName")); 
gift.setGiftPrice(rs.getInt("giftPrice")); 
gift.setGiftPhotoUrl(rs.getString("giftPhotoUrl"));
```

이 Setter 를 생략시킬 수 없을까 를 고민하다가 카테캠 3기 STEP#2 팀원분들한테 질문을 던졌는데, 굉장히 좋은 답변을 받았다.
@RequestBody 에서 Setter 를 사용하지 않아도 값을 넣어주는 것과 같은 매커니즘을 사용하는 것 같다.
그렇다면 이 매커니즘은 뭘까..하다가 다른 팀원분께서 Reflection 에 대해서 설명을 해주셨다.
설명해주신 내용덕분에 흥미를 붙였고, 이렇게 글을 써보고자 한다.

### Reflection
Setter 를 쓰고 싶지 않았다. ( 그 누구도 내 객체에 손을 안댔으면 좋겠다 라는 바램이 생겼다. )
그러면 어떻게 Setter 를 사용하지 않아도 되는 것일까.

Java 에는 **Reflection** 이라는 기능을 제공한다.

그렇다면 Reflection 이란 뭘까?
정확한 Class 의 Type 을 알지 못하여도, 해당 Class 의 Method, Type, Variables 에 접근할 수 있도록 해주는 자바 API 이다.
Compile 된 Java Byte Code ( .class 파일의 코드 ) 를 통해서 Runtime 에 동적으로 특정 Class 의 정보를 추출할 수 있도록 해주는 것이다!

Program 실행 중에, 사용자와 운영체제 및 기타 프로그램과 상호작용을 하면서 Class 와 Interface 등을 검사하고 조작할 수 있는 기능인데, 그렇다면 어떻게 이런 방식이 가능한 것인가 조금 자세히 알아보자.

Java 의 클래스는 Java Compiler 에 의해서 Java Byte 파일로 바뀌게 된다.
해당 Java Byte 파일은 Class Loader 에게 전달된다.
전달된 Byte 파일은 Class Loader 에 의해서 Runtime Data Areas 으로 넘어가게 되는데, 해당 Byte 파일의 Meta 정보가 Method Area 에 저장되게 된다.
따라서 개발자는 Reflection 을 사용할 때, 해당 Method Area 의 정보를 가져와서 이용하는 것이다.

![Java Runtime Data Areas](/images/java-runtime.png)

코드 작성 시점에서 모르는 Class 의 Type 에 대해서 객체를 생성하고, 이용하기 때문에 이때는 **동적 바인딩**을 사용해야 한다.
- 동적 바인딩에 대해서는 추후 자세히 설명할 예정이다.

예시를 들어 조금 더 자세히 알아보자.

```java
public class JpaFactory{ 
    public Object getInstance(String className){ 
        if(className == "Member"){ 
            return new Member(); 
        }else if(className == "Product"){ 
            return new Product(); 
        } 
    } 
}
```

위의 예제는 필자가 Jpa 에 대해서 고민했을 때, 고안한 첫 대안이다.
Generics 으로 정보를 받기 시도하기 전, 내가 만든 Entity Class 에 대해서 정보를 전달해주고 싶어, 위처럼 작성했다.
이렇게 작성했을 때의 문제점은 Entity 가 생길때마다 if/else 문이 늘어난다는 문제점이 발생했다.
( 객체지향에서 if/else 문은 필요치 않다는 사실을 상기하자. )

내가 파악한 Jpa 의 가장 큰 특징을 나열해보자면
1. Setter 를 설정하지 않아도 인스턴스 필드에 값을 주입할 수 있다.
2. Generics 으로 Class 의 변수 Type 을 전달해주면, 해당 Entity 의 Instance 를 얻을 수 있다.

이외에도 많은 특징들이 있지만, 주로 고민한 건 이 2가지였다.
그렇다면 위의 코드를 어떻게 바꿀 수 있었을까?

```java
public class SimpleJpaRepository{ 
    public Object getInstance(String className) throws Exception{ 
        Class cls = Class.forName(className); 
        Constructor constructor = cls.getConstructor(); 
        return constructor.newInstance(); 
    } 
}
```

위처럼 바꾸는 것이 가능하였다.
위의 코드로 바꾸게 되면,
Jpa Entity 를 만들기 위해서는 Lombok 의 `@NoArgsConstructor` 어노테이션을 무조건 적용해야 하는 이유가 아래에서 나온다.

```java
Constructor constructor = cls.getConstructor();
```

해당 코드에서 매개변수가 없는 객체를 가져와, Instance 를 발행해, 원하는 Class Instance 에 값을 주입할 수 있도록 빈 Instance 를 만들어주는 것이다.
그 뒤로부터는 Reflection 은 Field 에 접근할 수 있어, 아래와 같이 값을 집어 넣을 수 있다.

```java
public class SimpleJpaRepository{ 
    public T <T> getResult(T obj){ 
        Field field = obj.getField("name"); 
        // Public 일 경우, 아래와 같이 즉시 값을 삽입할 수 있다. 
        field.set(obj, "이무개"); 
        
        // Private 일 경우, 아래와 같이 접근성에 대해 수정을 해주어야 한다. 
        field.setAccessible(true); 
        field.set(obj, "이무개"); 
    } 
}
```

이렇게 우리는 Setter 를 사용하지 않고, 원하는 Class 에 값을 넣을 수 있도록 지원해주는 Reflection 에 대해서 한층 가까워졌다.
- 다른 방법들도 많으니, Reference 참고해주시면 감사하겠습니다.

### Reflection 은 무적일까?
빛이 있으면, 그림자도 있는 법.
이렇게 장점이 많을 때, 우리는 그림자를 무시하면 안된다.

이렇게 Runtime 에서 Class Type 에 대해 동적 바인딩을 진행하는데, 속도가 느리진 않을까? 라는 고민을 하는 분들이 무조건 있을 거라 생각한다.

![Reflection Performance 1](/images/reflection-perf-1.png)
![Reflection Performance 2](/images/reflection-perf-2.png)
위의 그래프를 보았을 때, Field 에 대해 Access 하는 시간은, Direct, Reference, Reflection 중 Reflection 이 가장 느리다.
메서드를 호출한 시간또한 Reflection 이 가장 느린 것을 확인할 수 있었다.

그렇다면 우리는 Reflection 을 사용하지 말아야 되는가?
필자의 생각은 아니라고 본다.

이전에 각 값 별로 분류를 해야하는 상황에서 N개의 Input 값이 있을 때, N 이 3을 넘어가게 되면, if문보다 switch 문을 쓰는 것이 성능 상 좋다.
물론 좋을 때가 있겠지만, 어떨 때에는 if 문이 가독성이 좋을 수 있고, switch 문을 선호하는 개발자가 있을거라고 생각한다.
눈에 도드라지는 성능 변화가 있을 경우, Reflection 사용을 멈춰야되겠지만,
만약 Reflection 사용을 하지 않을 때, 나는 if/else 문으로 돌아갈 자신이 없다.

## 느낀 점
Reflection 의 존재를 알고나서, Custom Jpa 를 구현해보고자 하는 욕망이 굉장히 크게 생기게 되었다.
현재 카카오 테크 캠퍼스 3기 진행 중이어서, 시간을 낼 수 있을 때, 많이 해보고 많이 물어보려고 한다.
이상으로 Setter 를 쓰기 싫어한 카카오 테크 캠퍼스 3기생이었다.
