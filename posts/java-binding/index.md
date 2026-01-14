---
title: "Binding"
description: 정적 바인딩(Static Binding)과 동적 바인딩(Dynamic Binding)의 차이와 개념
date: 2025-12-01 14:08:00+09:00
categories:
    - Tech
tags:
    - Java
    - Korean
    - Binding
    - Reflection
---

# [Java] Binding

## 개요
카카오 테크 캠퍼스 3기를 진행하면서, Reflection 에 대해 공부를 하면서 Dynamic Binding 이란 단어가 나와, 해당 개념은 어떤 개념일까? 라는 궁금증이 생겨 이렇게 포스팅까지 진행하게 되었다.

## 내용
### Binding
우선 정적 바인딩과 동적 바인딩을 배우기 전 한 가지 사실에 대해서 알아야 한다.
과연 바인딩 ( Binding ) 이란 무엇일까?

사전적인 정의를 먼저 얘기하자면
> 프로그램의 기본 단위가 가질 수 있는 구성요소의 구체적인 값 성격을 확정하는 것

Binding 이라고 부르는 또 다른 예시들이 있는데, 한번 살펴보자.
1. Computer Programming 에서 각종 값들이 확정되어서, 더 이상 변경할 수 없는 상태가 되는데→ 이 상태를 Binding 상태라고 한다.
2. Program 내에서 변수, 배열, Label, 절차 등의 명칭→ 식별자 ( Identifier ) 가 그 대상인 Memory 주소, Data 형, 실제 값으로 배정되는 것
3. 프로그래머가 코딩을 해서 Compile 을 하게 되면, 프로그래머가 값을 변경할 수 없는 상태가 되는 것→ Memory 에 값을 할당하는 것 또한 Binding 이다.

위와 같은 모든 것들이 Binding 으로 포함이 된다.
( 한국말로 구속하다 라는 의미를 갖고 있는데 비슷한 느낌으로 사용되는 것 같다 )

이 Binding 에는 2가지의 종류가 있다.
1. static binding ( 정적 바인딩 )
2. dynamic binding ( 동적 바인딩 )

private, final, static 멤버에 대해서는 **Static Binding** 을 사용하는 반면
가상 Method 에 대해서는 Binding 은 Runtime 객체에 기반하여 Runtime 중에 수행을 한다!

Java 에서는 Method 가 기본적으로 가상 Method 이다.
- 추후에 가상 Method 에 대해서 설명을 하고자 한다.

Static Binding 은 바인딩을 위해서 유형 정보를 사용하고, Overload 된 메서드는 Static Binding 을 사용한다.
같은 이름의 Method 가 여러 개 있는 경우에 어떤 Method 를 호출할 지 결정한다.

Dynamic Binding 은 바인딩을 확인하기 위해서 객체를 사용하고, Override 된 메서드는 Dynamic Binding 을 사용하여 Runtime 중에 해결할 수 있다.

### Static binding
Compiler 가 Compile 시점에 해결할 수 있는 Binding 은 아래의 명칭으로 부른다.
1. Static binding
2. 초기 Binding

모든 static, private, final method 의 binding 은 Compile 시점에서 이뤄지게 진다.

```java
// Java Program to Illustrate Static Binding 
// Main class 
class NewClass { 
    // Static nested inner class 
    // Class 1 
    public static class superclass { 
        // Method of inner class 
        static void print() { 
            // Print statement 
            System.out.println( "print() in superclass is called"); 
        } 
    } 
    // Static nested inner class 
    // Class 2 
    public static class subclass extends superclass { 
        // Method of inner class 
        static void print() { 
            // print statement 
            System.out.println( "print() in subclass is called"); 
        } 
    } 
    // Method of main class 
    // Main driver method 
    public static void main(String[] args) { 
        // Creating objects of static inner classes 
        // inside main() method 
        superclass A = new superclass(); 
        superclass B = new subclass(); 
        // Calling method over above objects 
        A.print(); 
        B.print(); 
    } 
}
```

예시를 살펴보고자 Reference 의 페이지에서 예시 코드를 가져왔다.
A 는 부모 Class 의 Instance 를 생성하고 있으며,
B 는 자식 Class 의 Instance 를 생성하고 있다.

이때, 출력의 결과는 2개 다 superclass 의 print 메서드를 호출하고 있는데, 이는 print 메서드가 static 으로 선언되어 있는 method 이기 때문이다.
static 멤버 혹은 메서드는 Compile 시점에 해당 Class 의 Memory 공간 ( Heap 영역 ) 에 저장된다.

`superclass B = new subclass();`

자식 Class 의 Instance 라 하여도, 참조 변수는 부모 Class 의 Instance 이므로,
print 메서드를 호출했을 시, 부모 Class 의 static method 로 호출하는 것이다.

### Dynamic Binding
동적 바인딩에서는 Compiler 가 호출할 메서드를 정하지 않는다.
→ Compiler 에게 권한이 없음!

```java
// Java Program to Illustrate Dynamic Binding 
// Main class 
public class GFG { 
    // Static nested inner class 
    // Class 1 
    public static class superclass { 
        // Method of inner class 1 
        void print(){ 
            // Print statement 
            System.out.println( "print in superclass is called"); 
        } 
    } 
    // Static nested inner class 
    // Class 2 
    public static class subclass extends superclass { 
        // Method of inner class 2 
        @Override 
        void print() { 
            // Print statement 
            System.out.println( "print in subclass is called"); 
        } 
    } 
    // Method inside main class 
    public static void main(String[] args) { 
        // Creating object of inner class 1 
        // with reference to constructor of super class 
        superclass A = new superclass(); 
        // Creating object of inner class 1 
        // with reference to constructor of sub class 
        superclass B = new subclass(); 
        // Calling print() method over above objects 
        A.print(); 
        B.print(); 
    } 
}
```

Dynamic Binding 은 Override 를 예로 들면 이해하기 편하다.
위의 예제의 출력결과는 아래와 같다.

A 같은 경우, superclass 의 print 메서드를
B 같은 경우, subclass 의 print 메서드를 출력한다.

왜 다를까?
간단하게 대답하면 `@Override` 어노테이션으로 본래의 메서드를 자식 Class 에 맞게 변형했기 때문이라고 말할 수 있다.
그리고 static method 가 아니기 때문에, Class 의 정보가 아닌 Instance 의 정보로 다뤄지고 있기도 하다.

Compile 하는 과정에서 Compiler 는 객체의 Type 이 아닌 참조 변수만 사용하기 때문에 어떤 것을 Print 해야될지 모르는 상황이 온다.
이 상황이 Runtime 까지 지속되며, Runtime 과정에서 객체의 Type 에 따라 Method 가 호출되기 때문에 자식 Class 의 Method 가 호출된 것이다!

## Static Binding vs. Dynamic Binding
여기서부터 필자의 생각이 조금 녹아들어있는 부분인데,
성능 면에서는 static binding 이 좋다고 생각이 든다.
따로 Overhead 도 생기지 않기 때문이기도 함..

Compiler 도 이러한 메서드가 Override 될 수 없고, 항상 Local Class 의 객체에 의해서 접근한다는 사실을 알고 있으면, Class 객체의 정보를 파악하는데에 아무런 문제가 없기 때문이다!
하지만 이 말이 모든 상황에서 static 을 붙이고, 하라는 것은 아니다.

동적 Binding 을 사용함으로써, 불특정 객체가 들어올 지 모르는 상황이 있을 수 있는데, 해당 객체에 대한 정보를 Runtime 에서 Binding 할 수 있다는 것 자체가 유지보수 측면에서 이득이라고 생각이 들기 때문이다.

## 느낀 점
Java 의 메모리 구조를 정확히 파악을 못하여, 오늘 설명하는 부분에서 메모리 부분을 내가 그려서 보여줄 수 있으면 더 좋은 포스팅이 되지 않았을까 싶어, 지금부터 메모리 부분 공부하러 가려고 한다..
주말인데, 날씨도 좋고, 그냥 나가서 코딩할까하다가 에어컨 바람이 너무 시원해서 집에서 포스팅을 끝마친다.
