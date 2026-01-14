---
title: "Static Area & Heap Area"
description: Java Static Area와 Heap Area의 차이와 메모리 구조에 대한 이해
date: 2025-12-14 14:16:00+09:00
categories:
    - Tech
tags:
    - Java
    - Korean
    - Memory
    - Static
    - Heap
    - Garbage Collection
---

# [Java] Static Area & Heap Area

## 개요
카카오 테크 캠퍼스 3기를 진행하면서, Static 키워드에 대해서 지적을 받았었다.
DTO 의 메서드에서 DTO -> Entity 로 변환하는 메서드를 static 으로 작성하였기 때문이다.
이 과정에서 왜 static 메서드로 지정하면 안될까에 대해서 생각을 조금 해보고자 한다.

## 내용

![Class Area vs Instance Area](/images/static-memory-1.png)

위의 그림을 보았을 때, Class 정보 영역은 static area 에 형성이 되고, heap area 에는 instance 들이 생성이 된다.
우리가 보통 new 연산을 진행하였을 때, static area 에 있는 class 정보를 바탕으로 heap area 에 instance 들이 생성이 된다.

그렇다면 여기에서 특징을 알아보자.

**static area 에는 어떤 것들이 있을까?**
- static method, class 에 대한 정보 등이 있다.
- 프로그램이 끝날 때까지 static 키워드가 붙은 method, 변수, class 에 대한 정보들은 삭제되지 않는다.

즉, 프로그램이 끝날 때까지 삭제되지 않고 program 의 메모리에 존재하는 것이다.

여기서 Java 에는 **Garbage Collector** 라는 것이 있다.
Garbage Collector 에 대해서는 다시 포스팅을 할 예정이지만, 우리는 단순히 GC ( Garbage Collector ) 가 안 쓰는 Instance 들을 Memory 로부터 해제한다는 역할만 알아두자.

그렇다면, static 영역은 GC 가 관여를 하는 부분일까?
아니다.

따라서 프로그램이 종료될 때까지 static Method, Variable, Class 에 대한 정보 등을 Memory 에 저장해놓을 수 있는 것이다.

여기서 우리가 왜 static 메서드에서 Field 변수나 public method 에 접근할 수 없는지에 대해서 알 수 있다.

![Static Method Access Issue](/images/static-memory-2.png)

위의 그림에서 printX 가 printY 를 호출한다고 가정하자.

printX 는 Static Memory 영역에 존재해서, Class 에 대한 정보가 기입 ( Class 가 Loading 되는 순간 )될 때 해당 method 에 대한 정보도 포함이 된다.
하지만 printY 는 public method 로써, Instance method 이다.

그러므로 해당 Method 에 대해서 Memory 가 할당되어 있지 않으면, 내부에 어떤 코드가 있는지 알 수 없는 것임.
그에 반해, printX 는 Static Memory 영역에 존재해서, Class 에 대한 정보가 기입될 당시 Method 가 이미 생성되어 있는 것과 동일하다.

그렇다면 printX 가 printY 를 호출하는 것은 존재하지 않는 영역을 가리키는 것과 동일해서 Compiler 가 에러를 발생시키는 것이다.
이 때문에 static 변수 또는 static method 가 Instance 변수 혹은 Instance method 에 접근하지 못하는 것이다.

## 느낀 점
코딩을 처음 접할 때에는 이러한 개념 자체를 알려고도 하지 않았으며, 단순히 외웠던 기억이 난다.
이거를 대학교 2학년 때 배운 것 같은데, 지금와서 복습하는 걸 보면 그때의 나는 제대로 공부한게 과연 맞을까 라는 의문이 생긴다.
앞으로 이런 실수를 하지 않기 위해서 조금 더 꼼꼼히 공부하고자 한다.
