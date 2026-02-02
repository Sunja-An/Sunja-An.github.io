---
title: "[Go] GoRoutine에 대해 고찰 (1)"
description: "GoRoutine이 왜 세상에 나오게 되었는지, 그리고 왜 이렇게 작은지에 대한 고찰"
date: 2026-02-02 20:49:06+09:00
categories:
    - develop
    - CS
tags:
    - Go
    - GoRoutine
    - CS
    - OS
    - Korean
---

# [Go] GoRoutine에 대해 고찰 (1)

---

*This is the post who is studying Go Language.*

*So, If you find something wrong point, please tell me or comment this post!*

## Go Routine 이 왜 세상에 나오게 되었을까?

---

![VS Code Go Tools Extension](/images/go/gotools.png)

Go lang 을 사용하면서, Go Routine 의 동작방식에 대해서 제대로 알지 못하는 상태에서 Go 키워드를 사용하고 있었다.

“다른 사람들은 Go Routine 을 사용하면 좋아!” 라고 말해왔지만, 정작 나는 왜 좋은지에 대해서 모른채로 Go 키워드를 난발하고 있었다…

그래서 GAMERS 프로젝트가 어느정도 완성이 되어가고 있으니, 여유가 생김으로써 이런 포스팅을 조금 작성해보고자 한다.

우선 소제목대로 Go Routine 이 왜 세상에 나오게 되었는가이다.

현대 Computer System 은 동시성을 얼마나 잘 처리하는가에 중점을 두고 있다.

그래서 기존 OS 의 Thread 를 통해서 동시성 처리를 하자니, Thread Context Switching 비용이 드는 것이 마음에 안 들었던 것.

기존 OS 의 Thread 들에 대해서 Context Switching 을 진행하게 되면, Kernel 이 개입을 하게 되는데, 이 작업이 생각보다 무겁다는 것이다.

또한 OS Thread 를 만들게 되면, 보통 1~2MB 의 고정 Stack Memory 를 차지하게 되는데, 10,000명의 접속자를 처리하기 위해서 10,000개의 Thread 를 만들 경우, 벌써 10~20GB 의 Memory 를 가져가게 된다.

- 참고로 필자의 Desktop Memory 성능은 16GB Memory 이다.

그렇다보니 개발자들은 더 작고, 더 빠른 Model 이 없을까? 를 고민하다가 Go Routine 을 만들게 된 것.

아주 작은 Memory ( 2KB ) 로 시작하고, Go Runtime 이 자체적으로 Scheduling 하는 Go Routine 을 말이다.

그러면 왜 이렇게 작고, 어떻게 자체적으로 Scheduling 을 할까? 라는 의문점이 생겼다.

::: tip 💡 GoRoutine 이 나온 계기
- 아래의 부분들을 개선하기 위해서!
    - OS Thread 는 고정 Stack Memory 1~2MB 의 공간을 차지한다.
    - Kernel 이 개입하는 context switching 비용이 너무 비싸다.
:::

## Go Routine 은 왜 이렇게 작은가?

---

Go Routine 의 Thread 는 2KB 로 굉장히 작은 편에 속한다.

그렇다면 왜 이렇게 작을 수 있는걸까?

해당 Thread 에 작업을 위임할 수 있는걸까? 라는 의문이 드는데, Go Routine 은 가변 Thread 로써 동작을 한다.

Go Routine 의 경우, Go 의 Runtime 이 상시 개입을 하는데, 함수를 실행할 때마다 “지금 Stack 공간으로 해당 함수를 실행할 수 있나?” 에 대해서 판단을 한 후, 함수를 실행한다.

이때 공간이 부족하다면, 현재 Stack 에 차지한 공간보다 2배 더 큰 공간을 만들어서, 해당 공간으로 Data 를 복사한다.

뭔가 이렇게 순서에 대해서 알아보았을 때, 처음 든 생각은 “이게 어떻게 가능한거지..?” 였다.

따라서 이 작업에 대해서 조금 더 이해를 해보고 싶었다.

GoLang이 가변 Thread 를 만들 수 있기 위해서는 Go 의 Runtime 이 프로그램을 실행 중에 있어서 계속 개입을 한다는 점이다.

Go 의 Compiler 는 함수가 시작되는 부분마다 Preamble 이라는 아주 짧은 Code 를 삽입한다.

Preamble → 이 코드가 Stack 에 공간이 충분한가를 Check 하는 검증 함수이다.

또한 해당 Code 가 CPU 의 Stack Pointer 와 Runtime 이 관리하고 있는 Stack Guard 값을 비교하는 아주 빠른 연산이 된다!

> 여기에서 Stack Guard 란?
> 

Preamble 이라는 Code 를 삽입할 때, 비교 기준으로 삼는 한계치 address 다.

Go Routine 의 Meta Data 에 저장되어있다!! ( 나중에 Meta Data 에 대해서도 알아볼 것 )

따라서 Preamble 이 해당 값을 보고, 한계치인지 확인을 하는 검증 코드인 것이다.

이때 공간이 만약 부족하다고 판단이 되면, Runtime 은 **`runtime.newstack`** 을 호출한다.

이후 아래의 과정을 거치게 되는데,

1. 공간을 2배 크기로 창출
2. 기존 Data 를 새 공간으로 복사
3. Go Routine 이 새로운 Data 가 담겨있는 공간에 대해서 Pointer 를 Update
    
    ![Go Dynamic Thread](/images/go/GoDynamicThread.png)
    

이렇게 되면 기존 Data 가 담겨있던 공간의 Pointer 는 어떻게 될까??

이때 Go Runtime 은 Stack Adjustment 이라는 작업을 수행한다.

Go 는 Stack Map 이라는 실행 중에서 Stack 의 어느 위치에 Pointer 가 존재하는지에 대해서 정확하게 알 수 있는 자료구조가 존재한다.

그래서 기존 Data 를 가리키고 있던 Pointer 에 대해서 수정을 할 때에 Pointer들을 찾아낸다.

해당 Pointer들의 주소에 이사한 거리 ( Offset ) 만큼의 거리를 더해서, New Stack 의 정확한 위치를 가리키게 수정!

이렇게 해서 Go 는 가변 Thread 를 만들어낼 수 있는 것이다.

현재 이 포스팅에서는 가변 Thread 를 어떻게 조작할 수 있는가에 대한 포스팅이었다.

다음 Posting 에서는 G:M:P Scheduling 에 대해서 알아보고자 한다.

## Author Contact

---

- 📫 sunja1472@gmail.com
- 🐙 [GitHub](https://www.github.com/Sunja-An)
