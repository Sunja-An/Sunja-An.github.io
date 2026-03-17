---
title: "[CS] フラグメンテーションに対して"
description: "メモリ管理のフラグメンテーションとGo言語のメモリアロケータ（TCMalloc/SLUB）についての解説"
date: 2026-03-17 19:41:12+09:00
categories:
    - develop
    - CS
tags:
    - Go
    - CS
    - OS
    - Memory
    - Japanese
---

# [CS] フラグメンテーションに対して

---

*本ポストは韓国人が書いたポストであります。*
*もし文法の方や、言葉におかしいなところがあったらぜひ教えてください！*

---

## 概要

---

Go言語のメモリ管理によって、フラグメンテーションに対して触れることができた。

外部断片化や、内部断片化に対して学び、勉強しながら発生した疑問点に対して記録をするために書いておきたいと思ってます。

## 内容

---

### External Fragmentation

メモリを確保する時や、開放する時、与えられたメモリの間に使用ができない場合がある。

空いてる空間があるので、この空間を使えないのが External Fragmentation ではある。

トータルで空いてる空間の合計ではメモリを使用しても良いが、その空間が分けられているとしたら大きいメモリ要求ができないのである、、

![External_Fragmentation.png](/images/fragmentation/External_Fragmentation.png)

なのでOS単位ではMemory圧縮や、Paging方法を使用するのだ。

### Internal Fragmentation

メモリ確保や、プロセスが要求した大きさよりもっと大きい固定大きさのメモリブロックを確保すると使えないエリアーが作られる。

例えば10KBが必要な時に16KBを確保すると6KBは使えないです。

なのでSlab Allocatorみたいに要求された大きさに一番近いメモリブロックを細分化して確保方式を使用する！

![Internal_Fragmentation.png](/images/fragmentation/Internal_Fragmentation.png)

だがこの文章の中で 「Slab Allocatorみたいに」 と言うことに対して少し深掘りをしてみよう。

---

### Slab Allocator

::: info
💡 OSのカーナルや、高性能メモリ管理ライブラリ等に使う効率的なメモリ確保方式！
単によく使っている大きさをお先に用意しとく方式だと理解すればしやすい！
:::

まずこの概念を勉強する前に三つの構造に集中してみよう。

- キャッシュ → 特定の大きさのオブジェクトのための管理者
- スラブ(Slab) → キャッシュがOSから確保された実際のメモリチャンク（多数のページ）！
- スロット / オブジェクト (Slot/Object) → Slabを一定な大きさで切ったメモリの破片

このSlab Allocatorは下のように動作します。

1. Look-up

プロセスが特定の大きさのメモリを要求すると、Slab Allocatorはこの大きさを受け取れる一番近い大きさのキャッシュを探します。
- Ex) 48 byte 要求 → 64 byte Cache

1. State Check

キャッシュの中のSlabのStateを確認する！

- FULL : 全てのスロットが使用中
- Partial：一部のスロットは使用中だが、一部は空いてる（優先順位）
- Empty：全てのスロットが空いてる

1. Allocation

- Partial Slabがあればその中に空いてるSlotをプロセスにすぐ与えます。
    - ここで検索時間がほぼ０です！
- PartialがなくEmtpy Slabだけあれば、そのSlabをPartial Stateに変更し、確保します。
- 全てのSlabがFullであれば、上位システム（Buddy System等）から新しいページをもらい、新しいSlabを作ります。

そしたらなぜこのようなSlab Allocatorがフラグメンテーションの方法で使われているのか！

まず先ほどExternal Fragmentationに対して学びましたが、Slab Allocatorは細分化をして一定な大きさで確保しておきます！

なのでExternal Fragmentationが発生されないです！

Ex) 
- 8KB 欲しい → 8KBのメモリ領域確保
- 4KB 欲しい → 4KBのメモリ領域確保

そして速度改善の部分がある。

毎回メモリのどこに入れるか計算する必要がなく、先に切っておいたスロットをすぐ渡せばいいのだ！

最後にキャッシュの効率が高いと言う部分だ。

同一な大きさのオブジェクトが物理的に近いところに集まっており、CPUのキャッシュ的中率が上がります！

---

ここで疑問なのが一つある。

> 空いてる空間があるって言うのをどうやって確認するのか？

二つの方式で

1. Free List
2. Bit Map

上の二つの方式で把握するのである！

#### Free List

空いてるメモリブロックをLinked Listで繋がり、管理する方式です。

各空いてるブロックは次のブロックのアドレスを指すポインターを含めています。

確保が必要でしたら、Listの一番先（Head）のブロックを出してあげ、開放されたらまたListに繋がります。

速度が速いと言う良いところがありますが、リストを探索していくとお互い離れている空いてる空間がつながっていて、連続の大きい空間を探しづらいと言う特徴があります。

なので探索過程で空いてる空間を把握できるようになります！

#### Bit Map

メモリを一定の大きさのブロックで分け、各ブロックのStateを０か１で表現する方式であります！

０は空いてる空間であり、１は使用してる空間という意味です。

ビットで管理しているので、State記録にかかるメモリがすごく低いですが、空いてる空間を探すためにBit Arrayを最初からスキャンするので、メモリが大きくなるほど探索速度が遅い可能性があります！

## それではなぜGo言語でこのような内容が必要なのか？

---

Goのメモリ確保原理はGoogleが作ったTCMallocに基づいて設計されました。

これはSlab Allocatorの上位バージョンで理解できるんですが、その原理は下のようになります！

1. mspanの登場

Slab Allocatorでメモリ一を定な大きさで切ったチャンクをSlabと呼びました！

ですがGo言語ではこれが**`mspan`**だと言っております！

Page （８KB）を一つや多数組んで作ったメモリブロックです。

Goでは役67個のSpan Class ( Size Class ) を持ちます！　（8B ~ 32KB まで）

要求されたオブジェクトの大きさで一番近いSpan Classを探してそのmspanの中の空いてるスロットを確保します。

なので先ほどSlabの細分化と同じ戦略を使います！

1. Lockがない確保

一般的なSlab Allocatorは多数のスレッドが同時にメモリに要求するとLock問題が発生される可能性があります！

Goはこれを解決するためにLayer Architectureを使用します。

- mcache （Per-p Cache ）
    - プロセス毎で持っているローカルキャッシュです。
    - Lockが必要ないのですごく速いです！
- mcentral （中央共有）
    - mcacheに空いてるスロットがないとここでmspanを持ってきます！
    - 多数のプロセスが共有するのでLockが必要です、、
- mheap （巨大Heap）
    - システム全体の巨大なメモリストレージです。
    - mcentralでもメモリがないとここでページ単位で新しく確保されます！

1. 空いてる空間確認：ビットマップ使用

Goではmspan内部でどんなスロットが空いてるか確認する時にBit Mapを使用します！

CPUのビット連山コマンドを利用して、空いてる空間を一瞬で探せます！

簡単にどのような差があるのか表で洗わせてみました！

| 比較項目 | Slab Allocator | Go Memory Allocator |
| --- | --- | --- |
| 最低単位 | Slot ( Object Size ) | Object ( Span Class 基準） |
| 管理単位 | Slab | mspan |
| Layer Architecture | 普通 1/2 Layer ( Local CPU Cache → Shared Cache ) | 3段階 Layer ( mcache → mcentral → mheap ) |
| Parallel 処理 | Lock Contention 発生可能性がある | Lock Free ( mcacheのおかげで性能優里） |
| メモリ記録 | 主にFree List | Bit Map ( allocBits ) |

だが現在Linuxで使ってるのはSlubです！

### SLUB

Slabは性能を高めるためにかくCPUでオブジェクトQueueをおいて複雑に管理しました。

だがシステムのCPUコアが数十、数百回で増えて管理用データ（MetaData）自体がメモリをたくさん確保する問題がありました。

これを解決するためにSlubが現れました。

- Metadataの単純化
    - SlabはSlabの状態を管理するために別の複雑なStructを使いました。
    - だがSlubはLinuxの基本ページのStructをそのまま活用します。
- Queue削除
    - 複雑なQueueを消して、現在使用しているSlabをむくポインターだけ維持して構造がすごく軽いです！
- 性能最適化
    - 大規模マルチーコアシステムでメモリOverheadが少ないし、キャッシュの効率がいいです！

上の特徴を見た時、GoのメモリAllocatorがSlubと似ていると思いました！

## 結論

---

内容的には勉強用で書いてたんですけど、実際に書きながら自分も疑問になる瞬間があって、それを納得できるまで勉強になる過程でした。

この内容でもまだ書いてないところや、勉強が足りない部分があるんだと思いますが、これは就職活動が終わった後で深掘りをもっとしようと思います！

## Reference

---

- https://github.com/google/tcmalloc
- https://en.wikipedia.org/wiki/Page_(computer_memory)
- https://docs.google.com/document/d/1TTj4T2JO42uD5ID9e89oa0sLKhJYD0Y_kqxDv3I3XMw/edit?tab=t.0
- https://jiravvit.tistory.com/entry/linux-kernel-4-%EC%8A%AC%EB%9E%A9%ED%95%A0%EB%8B%B9%EC%9E%90

## Author Contact

---

- 📫 sunja1472@gmail.com
- 🐙 [GitHub](https://github.com/Sunja-An)
