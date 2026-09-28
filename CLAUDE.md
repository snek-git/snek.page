# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Feliks/snek. Static site with no framework: plain HTML, CSS, JS. The only build step is `node build.js`.

## Commands

- **Install:** `npm install` (only `markdown-it`, used by build.js)
- **Build:** `node build.js`: renders posts to HTML, writes feed.xml and share.html, updates blog links in index.html
- **Dev server:** `python -m http.server` → localhost:8000
- **Deploy:** run `node build.js`, commit the generated files, push to `main`.
- **Film thumbnails:** `for f in img/film/*.jpg; do magick "$f" -resize 500x500 -quality 80 "img/film/thumbs/$(basename "$f")"; done`
- **Film lightbox copies:** `for f in img/film/*.jpg; do magick "$f" -resize 2000x2000 -quality 82 -strip "img/film/display/$(basename "$f")"; done`

## Architecture

- **Shared assets:** `style.css` holds theme tokens, base styles, the theme toggle and `.prose` (rendered markdown). `theme.js` is loaded in `<head>` of every page so the theme applies before first paint; it falls back to `prefers-color-scheme`, persists to localStorage and fires a `themechange` event on `document`. The toggle label comes from CSS (`::after`), so the button is empty in HTML.
- **build.js** reads `posts/*.md`, parses YAML-like frontmatter, renders markdown with markdown-it at build time into `posts/*.html` (with meta/og tags), regenerates `feed.xml`, and regex-replaces the blog links section in `index.html`.
- **Background art** (index.html only): picks a random image per theme, swaps on `themechange`. Repositions from fixed to static based on viewport width vs content width.
- **Game of Life** (index.html only): interactive canvas at top of page. Pointer events, pauses when the tab is hidden, static under `prefers-reduced-motion`.
- **Film gallery** (film.html): grid with lazy thumbs and a lightbox that loads `data-display` (2000px) with a "full res" link to `data-full`.
- **404 page** (404.html): Fate-themed. Pages serves it for any unknown path, so all its asset URLs must be absolute. The servant stats come from a hash of the path. Art goes in `img/404.webp` (the `<img>` removes itself if the file is missing). The summon pool is a hardcoded list in the page; update it when projects change.
- **Share page** (share.html): auto-generated file browser for `share/`. Hash-based navigation, client-side markdown rendering for `.md` files (markdown-it CDN), direct download for other files. Link files as `snek.page/share.html#/path/to/file.md`.

## Auto-generated files (don't edit by hand)

- `posts/*.html`: generated from corresponding `.md` files
- `feed.xml`: generated from all posts
- `share.html`: generated from `share/` directory contents
- Blog links section in `index.html`: replaced by build.js between `<h3>blog` and `</section>` (build fails if that pattern is missing)

## Adding a Blog Post

1. Create `posts/my-post.md` with frontmatter (`title`, `date`, `description`, optional `image` as a site path like `/img/foo.webp` for link previews; use a landscape image)
2. Run `node build.js`

## Adding Film Photos

1. Add full-res to `img/film/`, generate thumbnails into `img/film/thumbs/` and lightbox copies into `img/film/display/`
2. Add an `<img>` to the `film.html` grid with `data-display` and `data-full`, plus `loading="lazy"`

## Deployment

Cloudflare Pages project `snek-page`, connected to GitHub `snek-git/snek.page`. Every push to `main` deploys. There is no build command and the output dir is the repo root, so Pages serves the committed files as they are: always run `node build.js` and commit its output before pushing. Every file in the repo is public on snek.page.
