---
title: "Github Organization 에서의 Vercel 배포"
description: "Github Organization 에서 Vercel 로 배포하는 비용 절감 및 우회 방법"
date: 2026-01-27 17:55:00+09:00
lang: ko
categories:
    - develop
tags:
    - Vercel
    - Github Actions
    - CI/CD
---

# Github Organization 에서의 Vercel 배포

## Summary

---

Github Organization 에서 Vercel 을 배포하기 위해서는 Vercel 의 Pro 로 업그레이드해야만 했다.

Vercel 배포 단계에서 비용을 지불하면서까지 Project 의 배포를 진행하기에는 부담감이 있었기 때문에, 우회 방법에 대해서 찾아보던 중, 개인 Repository 라면 Vercel 에 무료로 배포할 수 있는 방법을 떠올리게 되었다.

이전 Basilium Project 를 하면서 동일한 상황에 이르르게 되었는데, Branch 에 PR 이 승인되고, Merge 가 되면 항상 수작업으로 개인 Repository 로 Pull 을 받아와야되는 부담이 있었다.

1. 원격 Repository 에 대해서 Merge
2. 원격 Repository 를 개인 Repository 로 Fork
3. 원격 Repository 에서 변경된 사항이 생길 때마다 개인 Repository 에서 아래의 명령어들을 순차적으로 실행
    1. git fetch upstream
    2. git merge upstream/develop
4. 위의 명령어 실행 후, push 를 해주면 vercel 에서 배포 시작

위의 과정을 반복하기에는 귀찮음이 있었기 때문에 CI/CD 를 이용해서 자동화하고자 해당 Post 를 작성하게 됐다.

## Content

---

![FEDeployLogic.png](/images/FEDeployLogic.png)

원하는 Architecture 는 위와 같이, Organization Repository 에서 branch 에 변화가 일어났을 경우, Github Action 에서 변화 감지 후, Single Repository 로 Push 를 하는 것이 목표이다.

따라서 아래와 같은 **`build.sh`** 를 작성하게 되었다.

```bash
#!/bin/sh
cd ../
mkdir output
cp -R ./GAMERS-FE/* ./output
cp -R ./output ./GAMERS-FE/
```

추가적으로 Github Action 과 같은 deploy.yaml 을 아래처럼 작성하면, commit 이 일어났을 때, 개인 Repository 로 commit 을 올릴 수 있도록 했다.

```bash
name: Deploy

on:
  push:
    branches: ['main']

jobs:
  build:
    runs-on: ubuntu-latest
    container: pandoc/latex
    steps:
      - uses: actions/checkout@v2
      - name: Install mustache (to update the date)
        run: apk add ruby && gem install mustache

      - name: creates output
        run: sh ./build.sh

      - name: Pushes to another repository
        id: push_directory
        uses: cpina/github-action-push-to-another-repository@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.AUTO_ACTIONS }}
        with:
          source-directory: 'output'
          destination-github-username: 'Github Username'
          destination-repository-name: 'Forked Repository Name'
          user-email: '${{ secrets.EMAIL }}'
          commit-message: '${{ github.event.commits[0].message }}'
          target-branch: main
          create-target-branch-if-needed: true

      - name: Test get variable exported by push-to-another-repository
        run: echo $DESTINATION_CLONED_DIRECTORY
```

<aside>
💡

> 아래의 Keyword 들을 Repository 의 Secret Variable 을 설정해줘야돼.
> 
- AUTO_ACTIONS: Github 개발자 Token ( PAT )
    - Repository 에 대해 접근할 수 있는 권한 설정 필요
- EMAIL: Github 의 Email
</aside>

하지만 위의 Github Action 을 실행했을 때, 아래와 같은 문제가 일어났는데,

<aside>
💡

```bash
Error: Could not clone the destination repository. Command:

Error: git clone --single-branch --branch main ***[github.com/Sunja-An/GAMERS-FE.git](http://github.com/Sunja-An/GAMERS-FE.git) /tmp/tmp.epMKJf
Error: (Note that if they exist USER_NAME and API_TOKEN is redacted by GitHub)

Error: Please verify that the target repository exist AND that it contains the destination branch name, and is accesible by the API_TOKEN_GITHUB OR SSH_DEPLOY_KEY
```

</aside>

위의 Log 를 보면, git clone 이 되지않는다. target repository 를 확인해달라는 로그를 볼 수 있는데, 이미 Github 의 Token 은 이미 설정되어있었고, Fork 또한 이미 되어있었다.

원인을 분석한 결과, 문제는 pandoc/latex 에 있었다.

보통 우리가 Java SpringBoot 나, WAS 를 올리기 위해 ubuntu-latest 환경에서 Build 를 하는 과정을 거치기에 나도 ubuntu-latest 환경처럼 pandoc/latex 또한 git 이 깔려있는 줄 알았다.

따라서 git 이 없었기 때문에, 위와 같은 에러가 발생하였고, git 을 다운로드받기 위해 아래와 같이 명령어를 수정해주었다.

```bash
- uses: actions/checkout@v2
- name: Install mustache (to update the date)
	run: apk add ruby git && gem install mustache
```

왜 ubuntu-latest 를 고르지 않고,pandoc/latex 를 선택하였는가에 대한 이유는 Github 의 Repository 를 복사하여, 개인 Repository 로 옮기기 위함이므로 이를 동작하게 하기 위해서 무거운 OS 를 고를 필요가 없었기 때문이다.

따라서 Github Action 과 Vercel 이 동작하는 것을 확인할 수 있었고, 이를 통해 Project 의 Vercel 배포 Pipeline 이 완성되었다.

## Conclusion

---

비용을 절감하기 위해서 고민하여 Pipeline 을 꾸리는 과정이 의미 깊었던 것 같다.

또한 Organization 에서 FE 배포가 안된다는 사실에 좌절하여, Docker 배포까지 생각을 했었는데, 여기에서 비용을 아낄 수 있어서 좋은 경험을 쌓은 것 같다.

## Reference

---

- https://velog.io/@rmaomina/organization-vercel-hobby-deploy
- https://jjang-j.tistory.com/93
- https://github.com/pandoc/pandoc-action-example
