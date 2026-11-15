# Sunja-An Blog

Personal blog of アンソヌ, built with Hugo and deployed to GitHub Pages (`https://sunja-an.github.io/`).
Document language: English. Site languages: Japanese at `/` (default), Korean at `/ko/`.

## Layout

| Path | What it is |
|---|---|
| `pre-content/` | Obsidian vault with drafts. Not read by Hugo. |
| `content/tech/` | Published tech posts (技術 Post, the developer self) |
| `content/life/` | Published daily posts (日常 Post, the personal self) |
| `content/about.<ja\|ko>.md`, `data/about.yaml` | About page: intro, career, education, tools |
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
| `language` | `Japanese` → `ja`, `Korean` → `ko`. Missing → `Japanese`. |
| `slug` | URL name, lowercase kebab-case ASCII (`endpointslice-update`). Required to publish. |
| `description` | Tech only: the one-line summary shown in the tech list |
| `cover` | Daily only: cover image file name in `_attachments/` (optional) |
| `createdAt` | Written when the note is created |
| `modified` | Last edit time, written by an Obsidian plugin as `2026-11-15T11:03:14+09:00` |
| `isFinished` | Checked = ready to publish. Unchecked notes are never published. |

The note's file name is the post title.

## Publishing (`pre-content` → `content`)

When asked to publish (e.g. "글 올려줘"):

1. Find notes in `pre-content/` (skip `_templates/`, `_attachments/`, `.obsidian/`) with `isFinished: true`.
2. Skip a note whose `slug` is empty or whose `type` is not `tech` / `daily`, and report it.
3. Write it as a page bundle: `content/<section>/<slug>/index.<lang>.md`, section from `type`,
   `<lang>` from `language`. A Japanese and a Korean note with the same `slug` are translations of
   each other: they share the bundle folder and its images, and the header's language switch links them.
   If the file exists, overwrite it (the note is the source of truth).
4. Front matter, converted from the note's properties:

   ```yaml
   ---
   title: "<note file name, without .md>"
   date: <createdAt>:00+09:00      # Obsidian stores 2026-11-14T22:30; Hugo needs the seconds
   lastmod: <modified>             # already full RFC 3339; no modified → use date
   description: "<description>"   # tech only, omit when empty
   cover: "<cover file name>"     # daily only, omit when empty
   draft: false
   ---
   ```

   Drop `type`, `slug`, `isFinished`, `createdAt`, `modified` and any other Obsidian-only property.
5. Body conversion:
   - Copy every image the note uses (and the `cover`) from `_attachments/` into the bundle folder; rewrite links to the bare file name (`![](photo.jpg)`).
   - Never copy a photo as is: phone photos carry GPS and EXIF. Write a clean copy with
     `ffmpeg -noautorotate -i in.jpg -vf "<rotate>,scale=-2:2000" -map_metadata -1 -q:v 3 out.jpg`
     (`<rotate>` from the EXIF orientation: upper-right → `transpose=1`, lower-left → `transpose=2`,
     lower-right → `hflip,vflip`, upper-left → `null`), then check that no `Exif`/`GPS` bytes remain.
   - If the `cover` image is also embedded in the body, drop that embed (the post page shows the cover on top).
   - `![417](file.jpg)` (Obsidian width syntax) → `![](file.jpg)`.
   - `![[file.png]]` embeds → `![](file.png)`.
   - `[[Other note]]` / `[[Other note|text]]` → a link to that note's published URL if it is published, otherwise plain text.
   - Remove Obsidian comments (`%% ... %%`).
6. Run `hugo --gc` and fix any error or warning before reporting.
7. Never delete or edit the note in `pre-content/` while publishing.
8. Report which notes were published (title → URL) and which were skipped and why.

Unpublishing: delete `content/<section>/<slug>/` (or one `index.<lang>.md`) only when the user asks.

## Languages

- UI strings live in `i18n/ja.yaml` and `i18n/ko.yaml`; templates never hard-code either language.
- Links inside templates go through `relLangURL` (`{{ "tech/" | relLangURL }}`).
- Section and About text per language: `content/<section>/_index.md` (ja) and `_index.ko.md`,
  `content/about.ja.md` and `about.ko.md`. Values in `data/about.yaml` that differ by language are
  `{ ja: "...", ko: "..." }` maps, read through `partial "loc.html"`.
- A post that exists in one language only shows only in that language's lists.

## Git

- Commit and push straight to `main`; no feature branches or PRs.
- Commit and push only when the user asks.
- Conventional Commits; a publish commit is `post: <title>` (several: `post: publish N posts`).
- `main` deploys automatically; after a push, check the "Deploy Hugo site to Pages" run.

## Local preview

`hugo server -D` → http://localhost:1313
