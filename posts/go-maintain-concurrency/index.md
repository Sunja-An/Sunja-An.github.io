---
title: "[Go] 並行性（Concurrency）はどのように実現されているのか？"
description: "Go言語がいかにして並行性を保ちながらスレッド間でコンテキストスイッチを行うかについての解説"
date: 2026-03-11 15:06:28+09:00
categories:
    - develop
    - CS
tags:
    - Go
    - GoRoutine
    - CS
    - OS
    - Japanese
---

# [Go] 並行性（Concurrency）はどのように実現されているのか？

---

*This is the post who is studying Go Language.*

*So, If you find something wrong point, please tell me or comment this post!*

---

## Concept

---

Go言語は並行処理に強い言語として知られています。
では、なぜ並行処理に強いと言われているのでしょうか？ その仕組みについて、実際にコードを動かしながら学んでいきましょう。

## Content

---

まず、ループ処理を含むロジックを書いてみました。
CPUが1つの時（シングルコア）、どのように並行性が保たれているかを確認したかったからです。
ゴルーチン（Goroutine）を起動し、チャネルを通じてタスクの受け渡しと結果の保存を行います。
これにより、ゴルーチンがどのようにスケジューリングされ、作業が進んでいくのかを可視化します。

### コード

```go
// main.go
package main

import (
	"context"
	"fmt"
	"go-practica/internal/worker"
	"runtime"
	"time"
)

func main() {
	fmt.Println(">>> System Start...")

	// CPU設定
	runtime.GOMAXPROCS(1)
	
	// countや、チャンネルのサイズを10としてテストします。
	// 動くGo Routineは5個として設定しました。
	pool := worker.NewPool(5, 10)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool.Start(ctx)
	go func() {
		for i := 1; i <= 20; i++ {
			pool.AddTask(worker.Task{ID: i, Payload: i * 10})
		}
		pool.Close()
	}()

	for res := range pool.Results() {
		fmt.Printf("[Main] Result Received: Task %d processed by Worker %d -> Value: %d\n", res.TaskID, res.Worker, res.Value)
	}

	fmt.Println(">>> All tasks completed. System shutdown.")
}
```

```go
// worker/pool.go
package worker

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Task struct {
	ID      int
	Payload int
}

type Result struct {
	TaskID int
	Value  int
	Worker int
}

type Pool struct {
	workerCount int
	tasks       chan Task
	results     chan Result
	wg          sync.WaitGroup
}

func NewPool(count int, buffer int) *Pool {
	return &Pool{
		workerCount: count,
		tasks:       make(chan Task, buffer),
		results:     make(chan Result, buffer),
	}
}

func (p *Pool) Start(ctx context.Context) {
	for i := 1; i <= p.workerCount; i++ {
		p.wg.Add(1)
		go p.work(ctx, i)
	}
}

func (p *Pool) work(ctx context.Context, id int) {
	defer p.wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		case task, ok := <-p.tasks:
			if !ok {
				return
			}
			sum := 0
			for i := 0; i < 1000000; i++ {
				sum += i
			}

			fmt.Printf("[Worker %d] Processing Task %d...\n", id, task.ID)
			time.Sleep(500 * time.Millisecond)

			val := task.Payload*2 + (sum % 10)
			p.results <- Result{TaskID: task.ID, Value: val, Worker: id}
		}
	}
}

func (p *Pool) AddTask(t Task) {
	p.tasks <- t
}

func (p *Pool) Close() {
	close(p.tasks)
	p.wg.Wait()
	close(p.results)
}

func (p *Pool) Results() <-chan Result {
	return p.results
}
```

### 結果

```bash
>>> System Start...
[Worker 1] Processing Task 1...
[Worker 2] Processing Task 2...
[Worker 3] Processing Task 3...
[Worker 4] Processing Task 4...
[Worker 5] Processing Task 5...
[Worker 4] Processing Task 6...
[Worker 1] Processing Task 8...
[Worker 2] Processing Task 9...
[Worker 3] Processing Task 10...
[Main] Result Received: Task 4 processed by Worker 4 -> Value: 80
[Main] Result Received: Task 5 processed by Worker 5 -> Value: 100
[Main] Result Received: Task 1 processed by Worker 1 -> Value: 20
[Main] Result Received: Task 2 processed by Worker 2 -> Value: 40
[Main] Result Received: Task 3 processed by Worker 3 -> Value: 60
[Worker 5] Processing Task 7...
[Worker 5] Processing Task 11...
[Main] Result Received: Task 7 processed by Worker 5 -> Value: 140
[Worker 4] Processing Task 12...
[Main] Result Received: Task 6 processed by Worker 4 -> Value: 120
[Worker 1] Processing Task 13...
[Main] Result Received: Task 8 processed by Worker 1 -> Value: 160
[Worker 2] Processing Task 14...
[Main] Result Received: Task 9 processed by Worker 2 -> Value: 180
[Worker 3] Processing Task 15...
[Main] Result Received: Task 10 processed by Worker 3 -> Value: 200
[Worker 1] Processing Task 16...
[Worker 5] Processing Task 18...
[Worker 4] Processing Task 19...
[Main] Result Received: Task 13 processed by Worker 1 -> Value: 260
[Main] Result Received: Task 15 processed by Worker 3 -> Value: 300
[Main] Result Received: Task 11 processed by Worker 5 -> Value: 220
[Main] Result Received: Task 12 processed by Worker 4 -> Value: 240
[Main] Result Received: Task 14 processed by Worker 2 -> Value: 280
[Worker 2] Processing Task 20...
[Worker 3] Processing Task 17...
[Main] Result Received: Task 17 processed by Worker 3 -> Value: 340
[Main] Result Received: Task 16 processed by Worker 1 -> Value: 320
[Main] Result Received: Task 18 processed by Worker 5 -> Value: 360
[Main] Result Received: Task 19 processed by Worker 4 -> Value: 380
[Main] Result Received: Task 20 processed by Worker 2 -> Value: 400
>>> All tasks completed. System shutdown.
```

結果を見ると、並行性が実現されていることがわかります。
出力順序は一定ではありませんが、プロセスがブロックされることなく、短いスパンでゴルーチンを切り替えながら作業が進んでいることが確認できます。
これが可能な理由は、ゴルーチンのスケジューリング特性にあります。

Goのスケジューラは、以下のような状況でスケジューリングを検討し、実行権限を譲ります（コンテキストスイッチ）。

1. **チャネル操作:** データの送受信で待機が必要な場合。
2. **システムコール（I/Oなど）:** ネットワーク通信やファイル読み書きなど、時間のかかる作業を行う場合。
3. **関数コール:** Goは関数が呼び出される際、スタックを確認し、スケジューリングを行うか判断します。
4. **明示的な待機:** `time.Sleep()` など。

ここで注目すべきはI/O作業です。画面への出力（`fmt.Printf`）もI/O作業の一種です。OSスレッド内でGoスケジューラがブロッキングを検知した際、ゴルーチン同士でコンテキストスイッチが発生します。この挙動について詳しく見ていきましょう。

### ブロックされた時のゴルーチンの動作

---

#### 1. ファイルI/O・システムコール（Hand-Off メカニズム）

ファイルI/Oなどのシステムコールを実行すると、それを実行しているOSスレッド（M）がブロックされます。
この時、プロセッサ（P）は「このスレッドは使えない」と判断し、自分自身をそのスレッドから切り離します（**Hand-Off**）。
そして、Pは準備ができている他のOSスレッドを探すか、新しく作成して、残りのゴルーチン（G）の処理を続行します。これが、一部のブロックがシステム全体を止めない理由です。

#### 2. ネットワークI/O（Netpoller）

::: info Note
**Netpollerとは？**
ゴルーチンがネットワーク作業をする際、OSスレッド（M）をブロックせずに効率よく待機できるようにするランタイムの仕組みです。
:::

![O(Go).png](/images/go/O(Go).png)

ネットワークの読み書きでブロックが発生すると、ゴルーチンはOSスレッドから離れ、**Netpoller** という監視エリアに移動します。
この瞬間、OSスレッドは即座に実行キュー（Run Queue）にある別のゴルーチンを実行します。結果として、OSスレッドを停止させることなく効率的に稼働し続けることができます。

> この処理は**ユーザー空間**で行われるため、カーネル空間へのコンテキストスイッチが発生せず、非常に高速です。

NetpollerはOS固有のイベント通知機構（Linuxの `epoll`、macOSの `kqueue` など）を利用してデータの到着を監視します。データが届くと、Netpollerは待機していたゴルーチンを「実行可能（Runnable）」状態に戻し、実行キューへ復帰させます。

### コードの考察

---

今回のコードには、`time.Sleep()` と `fmt.Printf()` というブロック要素が含まれています。
`fmt.Printf()` はシステムコール、`time.Sleep()` はタイマーによるブロックとして動作するため、これらがトリガーとなってゴルーチンの切り替え（コンテキストスイッチ）が発生し、シングルコアでも並行して動作しているように見えるのです。

## Conclusion

---

この記事を通して、ゴルーチンのコンテキストスイッチがどのように行われているかを実際に体感できました。
現在開発中のGAMERSプロジェクトでもGoを採用していますが、「なぜGoが並行処理に強いのか」という疑問を解消できたことで、より深くプロジェクトを理解できるようになりました。

## Reference

---

- https://jeongchul.tistory.com/763
- https://www.reddit.com/r/rust/comments/sciwsz/asyncawait_cooperative_vs_preemtive_scheduling/
- https://morsmachine.dk/netpoller.html

## Author Contact

---

- 📫 sunja1472@gmail.com
- 🐙 [GitHub](https://github.com/Sunja-An)
