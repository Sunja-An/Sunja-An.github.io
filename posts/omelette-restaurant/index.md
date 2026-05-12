---
title: "Omelette Restaurant"
description: "AtCoder ABC446_C Omelette Restaurant の解説"
date: 2026-03-02 12:25:00+09:00
lang: ja
categories:
    - algorithm
tags:
    - Java
    - Two Pointers
    - AtCoder
    - Algorithm
---

# 💻 解けた問題: Omelette Restaurant

- **URL**: [https://atcoder.jp/contests/abc446/tasks/abc446_c](https://atcoder.jp/contests/abc446/tasks/abc446_c)
- **所要時間**: 50分
- **解法アプローチ**: DP → One Pointer (Two Pointers)

```text
1. 最初にDPで全ての卵を足して、消耗する卵を消しながら解こうとしました。
2. しかし、初日に入れた卵から優先的に消耗するという条件があったため、Pointerの導入を考えました。
3. そのため、One Pointerで「消耗できる卵」や「消費期限が切れた卵」を管理しました。
```

## コード

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        final BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());

        int caseCnt = Integer.parseInt(st.nextToken());

        for(int i=0; i<caseCnt; i++){
            int value;

            st = new StringTokenizer(br.readLine());
            int N = Integer.parseInt(st.nextToken());
            int D = Integer.parseInt(st.nextToken());

            int[] arr = new int[N];

            st = new StringTokenizer(br.readLine());
            for(int j=0; j<N; j++){
                arr[j] = Integer.parseInt(st.nextToken());
            }

            st = new StringTokenizer(br.readLine());
            int curr = 0;

            for(int j=0; j<N; j++){
                value = Integer.parseInt(st.nextToken());

                int discardLimit = j - D;
                if (curr < discardLimit) {
                    curr = discardLimit;
                }
                
                while (curr < N && arr[curr] < value) {
                    value -= arr[curr];
                    arr[curr] = 0;
                    curr += 1;
                }

                if (curr < N) {
                    arr[curr] -= value;
                }
            }
            
            int discardLimit = N - D;
            if (curr < discardLimit) {
                curr = discardLimit;
            }

            long result = 0;
            for(int j=curr; j<N; j++){
                result += arr[j];
            }

            System.out.println(result);
        }
    }
}
```

## 学んだこと
- 今回のように「優先順位」や「先に消耗すべきもの」がある場合、配列ではPointer（Two Pointers / One Pointer）を使おうと思います。

## 反省点・改善点
- **DPで解けなかった場合、優先順位を考えよう**
    - 環境を用いて解決していくことも考えてDPを導入してみましたが、さすがに先に消耗すべき卵をDPで管理することはできませんでした（1日で消耗した卵をDPだと正確に計算・管理できないという問題点があったため）。
