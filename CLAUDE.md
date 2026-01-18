# snek.page

Personal website for Feliks/snek.

## Structure

```
index.html          - main page
film.html           - photo gallery
feed.xml            - RSS feed (auto-generated)
build.js            - generates feed.xml and updates blog links
posts/
  *.html            - blog post pages
  *.md              - blog post content (markdown with frontmatter)
img/
  lilith1.webp      - background art (random on load)
  lilith2.webp
  film/             - full resolution photos
  film/thumbs/      - thumbnails for gallery grid
```

## Adding a Blog Post

1. Create `posts/my-post.md` with frontmatter:
   ```
   ---
   title: My Post Title
   date: 2026-01-20
   description: Short summary for RSS
   ---

   # My Post Title

   Content here. Supports markdown + raw HTML for embeds.
   ```

2. Copy `posts/first-post.html` → `posts/my-post.html`
   - Update `<title>` tag
   - Update fetch path: `fetch('my-post.md')`

3. Run `node build.js` - updates feed.xml and blog links in index.html

## Adding Film Photos

1. Add full-res images to `img/film/`

2. Generate thumbnails:
   ```
   for f in img/film/*.jpg; do
     magick "$f" -resize 500x500 -quality 80 "img/film/thumbs/$(basename "$f")"
   done
   ```

3. Add to `film.html` grid:
   ```html
   <img src="img/film/thumbs/photo.jpg" data-full="img/film/photo.jpg" alt="">
   ```

## Local Development

```
python -m http.server
```
Then open `localhost:8000`

## Deployment

Hosted on Cloudflare Pages. Just push to main.

## Background Art Behavior

- Fixed in bottom-right corner when viewport is wide enough
- Moves to bottom of page when viewport < content width + image width + 40px buffer
- Randomizes between lilith1.webp and lilith2.webp on each load
