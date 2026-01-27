---
title: Golang-migrateを利用したデータベースヒストリー保存
description: Golang-migrateを利用したデータベースヒストリー保存 MySQL
date: 2026-01-14 12:35:00+09:00
categories:
    - DB
tags:
    - Go
    - MySQL
    - DB
    - Migrate
    - Japanese
---

# Golang-migrateを利用したデータベースヒストリー保存

## 概要
開発をしながら、Domain Schemaに対して修正が入る時にTable Schema変更が起きる状況が発生しました。
Test Fileではよく作動できますが、本番DBの時には勝手にTable Schemaを変更できないのでDB Migrationを導入しようと思いました。
一回データを持っている状況でのTable Schema変更はリスクが高く限界があると感じたからです。
なのでDBに対してVersion管理をすることになりました。

## 内容
現在自分が個人開発している「GAMERS」はGo、DiscordGo Libraryを利用して、ボットとWASとのMicro Service Architecture形で挑戦してます。
ここでGoでのMigrationはgolang-migrateのmigrate Libraryを利用することになりました。
開発を進みながら、自分のミスでPasswordのスキーマ条件がVARCHAR(16)として設定され、暗号化したパスワードが保存できない状況が発生しました。
このテーブルを削除してもう一度作るのもありましたが、本番DBがあったのでそのDBも変更する必要がありました。
なのでこれをVersion 2として変更事項を適用することにしました。
golangのmigrateはFlywayと違って、Versionづつ Up, Down SQLファイルを作成する必要がありましたが、自分としてどうやってバージョンアップや、ダウンされるのかすぐ見えて理解しやすかったです。
後ではMakefileでDB Version管理に利用されているコマンドを入力して、今後チームメンバーが入ってきた時便利に利用できるよう書類化しました。

```makefile
migrate-up: ## Run all pending migrations
	@echo "🔄 Running migrations..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" up

migrate-down: ## Rollback last migration
	@echo "⏪ Rolling back last migration..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down 1

migrate-down-all: ## Rollback all migrations
	@echo "⏪ Rolling back all migrations..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down -all; \
	fi

migrate-create: ## Create new migration (usage: make migrate-create name=create_users_table)
	@if [ -z "$(name)" ]; then \
		echo "❌ Error: name parameter is required"; \
		echo "Usage: make migrate-create name=create_users_table"; \
		exit 1; \
	fi
	@echo "📝 Creating migration: $(name)"
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)

migrate-version: ## Show current migration version
	@migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" version

migrate-force: ## Force set migration version (usage: make migrate-force version=1)
	@if [ -z "$(version)" ]; then \
		echo "❌ Error: version parameter is required"; \
		echo "Usage: make migrate-force version=1"; \
		exit 1; \
	fi
	@echo "⚠️ Forcing migration version to $(version)..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" force $(version)

migrate-up-docker: ## Run migrations in Docker environment
	@echo "🔄 Running migrations (Docker)..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" up

migrate-down-docker: ## Rollback migration in Docker environment
	@echo "⏪ Rolling back migration (Docker)..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down 1

migrate-version-docker: ## Show migration version in Docker
	@migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" version
```

自分は今現在DockerfileでDeployしていますのでDockerを通じてMigrateができるようコマンドを作成しときました。
最後にバージョンアップした後の結果、下のように変更されたのを確認することができました。

## 結論
実際本番DBに使うためにMigrateを適用することになりましたが、Migrateを知る前までは本番DBに直接アクセスしてテーブルを変える時が多かったのです。
だが韓国の大学でGDGoC活動をやりながらこのような行為が危ないことなのを認知して初めて導入してみましたが、開発する時も便利にバージョンを分別することができて楽に開発ができました。
今までは簡単なMigrateだけでしたが、もっとサービスが大きくなって修正事項が多くなった時にどうやってバージョンを分けるのかを勉強していきたいと思います。
