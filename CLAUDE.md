# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Feliks/snek. Static site with no framework — plain HTML, CSS, JS. The only build step is `node build.js`.

## Commands

- **Build:** `node build.js` — generates post HTML files, feed.xml, and updates blog links in index.html
- **Dev server:** `python -m http.server` → localhost:8000
- **Deploy:** `npx wrangler pages deploy . --project-name=snek-page` (or `bash deploy.sh` which runs build + deploy)
- **Generate film thumbnails:** `for f in img/film/*.jpg; do magick "$f" -resize 500x500 -quality 80 "img/film/thumbs/$(basename "$f")"; done`

## Architecture

- **No dependencies** for the site itself. `build.js` uses only Node builtins (fs, path). Posts render markdown client-side via markdown-it CDN.
- **build.js** reads `posts/*.md`, parses YAML-like frontmatter, generates an HTML shell for each post (`posts/*.html`), regenerates `feed.xml`, and regex-replaces the blog links section in `index.html`.
- **Theme system:** CSS custom properties on `:root` / `:root.dark`. Theme toggle + localStorage persist across pages. Each page has its own inline theme toggle script (not shared).
- **Background art** (index.html only): randomizes between image sets per theme. Repositions from fixed to static based on viewport width vs content width.
- **Game of Life** (index.html only): interactive canvas animation at top of page.
- **Film gallery** (film.html): grid with lightbox, keyboard nav, click-through to full-res via `data-full` attribute.
- **Share page** (share.html): auto-generated file browser for `share/` directory. Hash-based navigation, client-side markdown rendering for `.md` files, direct download for other files.

## Auto-generated files (don't edit by hand)

- `posts/*.html` — generated from corresponding `.md` files
- `feed.xml` — generated from all posts
- `share.html` — generated from `share/` directory contents
- Blog links section in `index.html` — replaced by build.js between `<h3>blog` and `</section>`

## Adding a Blog Post

1. Create `posts/my-post.md` with frontmatter (`title`, `date`, `description`)
2. Run `node build.js`

## Adding Film Photos

1. Add full-res to `img/film/`, generate thumbnails to `img/film/thumbs/`
2. Add `<img>` tag to `film.html` grid with `data-full` pointing to full-res

## Deployment

Hosted on Cloudflare Pages. Build command: `node build.js`
