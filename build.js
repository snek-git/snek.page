const fs = require('fs');
const path = require('path');

const POSTS_DIR = './posts';
const SITE_URL = 'https://snek.page';

const POST_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - snek.page</title>
  <link rel="alternate" type="application/rss+xml" title="snek.page" href="/feed.xml">
  <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>
  <style>
    :root {
      --bg: #fff;
      --text: #222;
      --link: #0066cc;
      --visited: #551a8b;
      --code-bg: #f4f4f4;
    }
    :root.dark {
      --bg: #2b2b2b;
      --text: #e0e0e0;
      --link: #8cb4ff;
      --visited: #b8a0d8;
      --code-bg: #1a1a1a;
    }
    body { padding: 1rem; max-width: 600px; margin: 0 auto; background: var(--bg); color: var(--text); }
    a { color: var(--link); }
    a:visited { color: var(--visited); }
    pre { background: var(--code-bg); padding: 1rem; overflow-x: auto; }
    code { background: var(--code-bg); padding: 0.2rem 0.4rem; }
    pre code { padding: 0; }
    img { max-width: 100%; height: auto; }
    iframe { max-width: 100%; }
    .back-link { margin-bottom: 1rem; }
    .theme-toggle {
      position: fixed;
      top: 10px;
      right: 10px;
      background: var(--text);
      color: var(--bg);
      border: none;
      padding: 0.3rem 0.6rem;
      cursor: pointer;
      font-size: 12px;
      z-index: 10;
    }
  </style>
</head>
<body>
  <button class="theme-toggle" id="theme-toggle">dark</button>
  <div class="back-link"><a href="/">← back</a></div>
  <article id="content"></article>
  <script>
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    let isDark = localStorage.getItem('theme') === 'dark';
    function applyTheme() {
      document.documentElement.classList.toggle('dark', isDark);
      themeToggle.textContent = isDark ? 'light' : 'dark';
    }
    applyTheme();
    themeToggle.addEventListener('click', () => {
      isDark = !isDark;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyTheme();
    });

    const md = window.markdownit({ html: true, linkify: true, breaks: true });
    fetch('{{slug}}.md')
      .then(r => r.text())
      .then(text => {
        const content = text.replace(/^---\\n[\\s\\S]*?\\n---\\n*/, '');
        document.getElementById('content').innerHTML = md.render(content);
      });
  </script>
</body>
</html>`;

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) frontmatter[key.trim()] = rest.join(':').trim();
  });
  return frontmatter;
}

function getPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontmatter(content);
    if (!meta) return null;
    const slug = file.replace('.md', '');
    if (!meta.date) {
      meta.date = fs.statSync(filePath).mtime.toISOString().split('T')[0];
    }
    return { ...meta, slug, file };
  }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generatePostHTML(post) {
  return POST_TEMPLATE
    .replace(/{{title}}/g, post.title)
    .replace(/{{slug}}/g, post.slug);
}

function generateRSS(posts) {
  const items = posts.map(p => `    <item>
      <title>${p.title}</title>
      <link>${SITE_URL}/posts/${p.slug}.html</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${p.description || ''}</description>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>snek.page</title>
    <link>${SITE_URL}</link>
    <description>Feliks / snek - ai engineer, games, thoughts</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

function generateBlogLinks(posts) {
  return posts.map(p =>
    `        <p><a href="/posts/${p.slug}.html">${p.date} - ${p.title}</a></p>`
  ).join('\n');
}

function updateIndex(posts) {
  let html = fs.readFileSync('./index.html', 'utf-8');
  const blogLinks = generateBlogLinks(posts);
  html = html.replace(
    /(<h3>blog.*?<\/h3>\n)([\s\S]*?)(<\/section>)/,
    `$1${blogLinks}\n      $3`
  );
  fs.writeFileSync('./index.html', html);
}

const posts = getPosts();

// Generate HTML for each post
posts.forEach(post => {
  const htmlPath = path.join(POSTS_DIR, `${post.slug}.html`);
  fs.writeFileSync(htmlPath, generatePostHTML(post));
  console.log(`Generated ${htmlPath}`);
});

fs.writeFileSync('./feed.xml', generateRSS(posts));
updateIndex(posts);
console.log(`Built ${posts.length} posts`);
