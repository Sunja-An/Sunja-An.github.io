---
title: "Tomato (トマト)"
description: "BOJ 7576 トマト問題の解説及びStringTokenizerの性能分析"
date: 2026-01-20 16:50:00+09:00
categories:
    - Algorithm
tags:
    - Java
    - BFS
    - BOJ
    - Algorithm
---

# トマト (Tomato)

- **所要時間**: 30分
- **解法アプローチ**:

```
1. 問題文から「熟したトマトの隣接するトマトも熟していく」という点に着目しました。
2. 入力を受け取る際、値が「1（熟したトマト）」の座標をQueueに追加し、BFS（幅優先探索）を用いて熟していくトマトの日数を計算すればよいと考えました。
```

- **コード**:

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Queue;
import java.util.StringTokenizer;

class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        StringTokenizer st = new StringTokenizer(br.readLine());
        int m = Integer.parseInt(st.nextToken());
        int n = Integer.parseInt(st.nextToken());

        int[][] arr = new int[n][m];

        Queue<int[]> queue = new LinkedList<>();

        int[] dx = {-1, 1, 0, 0};
        int[] dy = {0, 0, -1, 1};

        for (int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine());
            for (int j = 0; j < m; j++) {
                arr[i][j] = Integer.parseInt(st.nextToken());
                if (arr[i][j] == 1) {
                    queue.add(new int[]{i, j});
                }
            }
        }

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int cx = current[0];
            int cy = current[1];

            for (int i = 0; i < 4; i++) {
                int nx = cx + dx[i];
                int ny = cy + dy[i];

                if (nx >= 0 && nx < n && ny >= 0 && ny < m && arr[nx][ny] == 0) {
                    arr[nx][ny] = arr[cx][cy] + 1;
                    queue.add(new int[]{nx, ny});
                }
            }
        }

        int result = 0;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (arr[i][j] == 0) {
                    System.out.println(-1);
                    return;
                }
                if (result < arr[i][j]) {
                    result = arr[i][j];
                }
            }
        }

        System.out.println(result - 1);
    }
}
```

- **学んだこと**:
    - 文字列処理（String）において、`StringTokenizer` の方が演算速度が速いことを確認しました。
- **反省点・改善点**:
    - 初期のコードは整理されておらず、冗長な部分が多くありました。
    - 一時変数（temp variable）を使用してトマトの日数を計算するなど、不要な演算が含まれていました。
    - 条件として「トマトが1であれば熟している」とされていましたが、1以上の値に対する制約が特になかったため、日数の計算を直接 `arr` 配列上で行うように改善しました。

下記のパフォーマンステストコードを作成し、`StringTokenizer` の方が演算速度が速いことを確認しました。

```java
import java.util.StringTokenizer;

class SpeedTest {
    public static void main(String[] args) {
        int DATA_SIZE = 10_000_000;
        System.out.println("Creating Data (" + DATA_SIZE + ")... Wait a moment.");

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < DATA_SIZE; i++) {
            sb.append(i).append(" ");
        }
        String inputData = sb.toString();

        System.out.println("Complete! Length: " + inputData.length());
        System.out.println("--------------------------------------------------");

        long startSplit = System.currentTimeMillis();

        String[] splitResult = inputData.split(" ");
        int sumSplit = 0;
        for(String s : splitResult) {
            sumSplit += s.length();
        }

        long endSplit = System.currentTimeMillis();
        System.out.println("[String.split] Duration: " + (endSplit - startSplit) + "ms");

        long startToken = System.currentTimeMillis();

        StringTokenizer st = new StringTokenizer(inputData);
        int sumToken = 0;
        while(st.hasMoreTokens()) {
            String s = st.nextToken();
            sumToken += s.length();
        }

        long endToken = System.currentTimeMillis();
        System.out.println("[StringTokenizer] Duration: " + (endToken - startToken) + "ms");

        System.out.println("--------------------------------------------------");
        System.out.println("Result: StringTokenizer is faster!! It's a figure of how fast StringTokenizer is." +
                (double)(endSplit - startSplit) / (endToken - startToken));
    }
}
```

---
**問題リンク**: [https://www.acmicpc.net/problem/7576](https://www.acmicpc.net/problem/7576)
