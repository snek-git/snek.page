# snek.page

Personal website for Feliks/snek.

## Structure

```
index.html          - main page
film.html           - photo gallery
feed.xml            - RSS feed (auto-generated)
build.js            - generates post HTML, feed.xml, and updates blog links
posts/
  *.md              - blog post content (markdown with frontmatter)
  *.html            - auto-generated from .md files
img/
  lilith1.webp      - background art dark mode
  lilith2.webp
  lilith1_light.webp - background art light mode
  lilith2_light.webp
  lilith3_light.webp - light mode only
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

2. Run `node build.js` - generates HTML, updates feed.xml and blog links

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

Hosted on Cloudflare Pages. Build command: `node build.js`

## Theme Toggle

- Light mode default, dark mode toggle on all pages
- Theme preference saved to localStorage
- Background art swaps between light/dark variants
- lilith3 only available in light mode

## Background Art Behavior

- Fixed in bottom-right corner when viewport is wide enough
- Moves to bottom of page when viewport < content width + image width + 40px buffer
- Randomizes between available images on each load
