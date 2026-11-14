# Sunja-An Blog

Personal blog of アンソヌ, built with Hugo and deployed to GitHub Pages (`https://sunja-an.github.io/`).
Document language: English. Site language: Japanese (Korean `/ko/` planned, not enabled).

## Layout

| Path | What it is |
|---|---|
| `pre-content/` | Obsidian vault with drafts. Not read by Hugo. |
| `content/tech/` | Published tech posts (技術 Post, the developer self) |
| `content/life/` | Published daily posts (日常 Post, the personal self) |
| `content/about.md`, `data/about.yaml` | About page: intro, career, education, tools |
| `layouts/` | Site templates (home, `tech/list`, `life/list`, `_default/single`, `_default/about`) |
| `static/css/site.css` | Site styles on top of the Taste kit tokens |
| `static/assets/` | Taste skill kit (system.css, motion, icons). Do not edit kit files. |
| `.github/workflows/hugo.yml` | Builds and deploys on push to `main` |

Tech and daily posts stay separate: never put one kind in the other's section.

## Drafts in `pre-content/`

Notes are made from the Obsidian templates in `pre-content/_templates/` (`tech.md`, `daily.md`).
Images go in `pre-content/_attachments/`.

| Property | Meaning |
|---|---|
| `type` | `tech` → `content/tech/`, `daily` → `content/life/` |
| `slug` | URL name, lowercase kebab-case ASCII (`endpointslice-update`). Required to publish. |
| `description` | Tech only: the one-line summary shown in the tech list |
| `cover` | Daily only: cover image file name in `_attachments/` (optional) |
| `createdAt` | Written when the note is created |
| `modifiedAt` | Last edit time (update it by hand or with a plugin) |
| `isFinished` | Checked = ready to publish. Unchecked notes are never published. |

The note's file name is the post title.

## Publishing (`pre-content` → `content`)

When asked to publish (e.g. "글 올려줘"):

1. Find notes in `pre-content/` (skip `_templates/`, `_attachments/`, `.obsidian/`) with `isFinished: true`.
2. Skip a note whose `slug` is empty or whose `type` is not `tech` / `daily`, and report it.
3. Write it as a page bundle: `content/<section>/<slug>/index.md`, section from `type`.
   If that bundle exists, overwrite it (the note is the source of truth).
4. Front matter, converted from the note's properties:

   ```yaml
   ---
   title: "<note file name, without .md>"
   date: <createdAt>:00+09:00      # Obsidian stores 2026-11-14T22:30; Hugo needs the seconds
   lastmod: <modifiedAt>:00+09:00
   description: "<description>"   # tech only, omit when empty
   cover: "<cover file name>"     # daily only, omit when empty
   draft: false
   ---
   ```

   Drop `type`, `slug`, `isFinished`, `createdAt`, `modifiedAt` and any other Obsidian-only property.
5. Body conversion:
   - Copy every image the note uses (and the `cover`) from `_attachments/` into the bundle folder; rewrite links to the bare file name (`![](photo.jpg)`).
   - `![[file.png]]` embeds → `![](file.png)`.
   - `[[Other note]]` / `[[Other note|text]]` → a link to that note's published URL if it is published, otherwise plain text.
   - Remove Obsidian comments (`%% ... %%`).
6. Run `hugo --gc` and fix any error or warning before reporting.
7. Never delete or edit the note in `pre-content/` while publishing.
8. Report which notes were published (title → URL) and which were skipped and why.

Unpublishing: delete `content/<section>/<slug>/` only when the user asks.

## Git

- Commit and push straight to `main`; no feature branches or PRs.
- Commit and push only when the user asks.
- Conventional Commits; a publish commit is `post: <title>` (several: `post: publish N posts`).
- `main` deploys automatically; after a push, check the "Deploy Hugo site to Pages" run.

## Local preview

`hugo server -D` → http://localhost:1313
