---
title: "Github ENV FILE 설정"
description: "Github Actions에서 ENV 파일을 Secret으로 관리하여 배포 환경을 개선한 경험"
date: 2026-02-03 17:45:32+09:00
categories:
    - develop
tags:
    - Github Actions
    - CI/CD
    - ENV
---

# Github ENV FILE 설정

## 개요

---

나의 배포 환경에서 ENV 파일의 속성에 대해 일일이 Secret 을 설정하는 부분이 있었다.

Cloudflare R2 에 대해서 Secret 을 설정하려고 하니, secret 하나하나 설정해야 되는 번거로움이 있어, 이 기회를 틈타 로직을 개선하려 포스팅을 한다.

## 내용

---

나의 로직은 아래처럼 Env 전체를 복사하여, 파일 자체를 복사해서 GCP 에 업로드를 하는 것이다.

```bash
name: Deploy to GCP Compute Engine

on:
  push:
    branches:
      - main
    paths:
      - 'docker-compose.yaml'
      - 'deploy.sh'
      - 'mysql/init/**'
      - '.github/workflows/deploy-gcp.yml'
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy Docker Compose to GCP VM
    runs-on: ubuntu-latest
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Copy files to VM
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.GCP_VM_PROD_HOST }}
          username: ${{ secrets.GCP_VM_PROD_USER }}
          key: ${{ secrets.GCP_VM_PROD_SSH_KEY }}
          source: "docker-compose.yaml,deploy.sh,Makefile,mysql/init"
          target: "~/app"
          overwrite: true

      - name: Execute SSH command to deploy
        uses: appleboy/ssh-action@v1.0.3
        env:
          GHCR_PAT: ${{ secrets.GHCR_PAT }}
          GITHUB_ACTOR: ${{ github.actor }}
          REPO_URL: "https://${{ github.actor }}:${{ secrets.GHCR_PAT }}@github.com/${{ github.repository }}.git"
          ENV_FILE: ${{ secrets.ENV_FILE }}
        with:
          host: ${{ secrets.GCP_VM_PROD_HOST }}
          username: ${{ secrets.GCP_VM_PROD_USER }}
          key: ${{ secrets.GCP_VM_PROD_SSH_KEY }}
          port: 22
          envs: GHCR_PAT,GITHUB_ACTOR,REPO_URL,ENV_FILE
          script: |
            if [ ! -d "GAMERS-INFRA" ]; then
              echo "📂 Repository not found. Cloning..."
              git clone $REPO_URL GAMERS-INFRA
            fi
            
            cd GAMERS-INFRA
            
            git remote set-url origin $REPO_URL
            git pull origin main
            
            echo "📝 Generating .env file..."
            echo "$ENV_FILE" > .env
            echo "✅ .env file created."
            
            if [ -z "$GHCR_PAT" ]; then
              echo "❌ Error: GHCR_PAT secret is empty."
              exit 1
            fi
            
            echo "🔐 Logging in to GHCR..."
            echo "$GHCR_PAT" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
            
            chmod +x deploy.sh
            ./deploy.sh
```

위의 내용을 보면 Secrets 에 env 전체의 내용이 들어가도록 설정을 해놨다.

해당 작업을 통해서 나의 secret 변수의 개수는 41개에서 총 5개로 줄어드는 것을 확인하였다.

## 결론

---

GCP 에도 secert 을 관리할 수 있는 Tool 이 있고, SOPS 로 관리할 수 있었다.

하지만 나의 프로젝트 크기에 따라서 ENV 파일을 복사하여, GCP 에서 관리하는게 편하다고 생각했기 때문에 이번에는 해당 방식을 이용하였다.

프로젝트의 규모가 커지면 GCP 에서 secret 을 관리하거나, SOPS 로 관리해보는 경험을 해보고자 한다.
