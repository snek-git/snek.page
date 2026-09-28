const fs = require('fs');
const path = require('path');
const markdownit = require('markdown-it');

const POSTS_DIR = './posts';
const SHARE_DIR = './share';
const SITE_URL = 'https://snek.page';

const md = markdownit({ html: true, linkify: true, breaks: true });

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const POST_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}} - snek.page</title>
  <meta name="description" content="{{description}}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{{url}}">
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{description}}">
{{image}}  <link rel="alternate" type="application/rss+xml" title="snek.page" href="/feed.xml">
  <link rel="stylesheet" href="/style.css">
  <script src="/theme.js"></script>
  <style>
    body { max-width: 600px; margin: 0 auto; }
  </style>
</head>
<body>
  <button class="theme-toggle" id="theme-toggle" aria-label="toggle theme"></button>
  <div class="back-link"><a href="/">← back</a></div>
  <article class="prose">
{{content}}
  </article>
</body>
</html>
`;

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
    const body = content.replace(/^---\n[\s\S]*?\n---\n*/, '');
    return { ...meta, slug, file, html: md.render(body) };
  }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generatePostHTML(post) {
  const image = post.image
    ? `  <meta property="og:image" content="${escapeHtml(SITE_URL + post.image)}">\n  <meta name="twitter:card" content="summary_large_image">\n`
    : '';
  const fields = {
    title: escapeHtml(post.title),
    description: escapeHtml(post.description || ''),
    url: `${SITE_URL}/posts/${post.slug}.html`,
    image,
    content: post.html,
  };
  return POST_TEMPLATE.replace(/{{(\w+)}}/g, (_, key) => fields[key]);
}

function generateRSS(posts) {
  const items = posts.map(p => {
    const link = `${SITE_URL}/posts/${p.slug}.html`;
    return `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeHtml(p.description || '')}</description>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>snek.page</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Feliks / snek - ai engineer, games, thoughts</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

function generateBlogLinks(posts) {
  return posts.map(p =>
    `        <p><a href="/posts/${p.slug}.html">${p.date} - ${escapeHtml(p.title)}</a></p>`
  ).join('\n');
}

function updateIndex(posts) {
  const html = fs.readFileSync('./index.html', 'utf-8');
  const pattern = /(<h3>blog.*?<\/h3>\n)([\s\S]*?)(<\/section>)/;
  if (!pattern.test(html)) throw new Error('index.html: blog section not found');
  fs.writeFileSync('./index.html', html.replace(pattern, `$1${generateBlogLinks(posts)}\n      $3`));
}

const SHARE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>share - snek.page</title>
  <link rel="stylesheet" href="/style.css">
  <script src="/theme.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>
  <style>
    body { max-width: 800px; margin: 0 auto; }
    .breadcrumbs { margin-bottom: 1rem; font-size: 0.9em; }
    .breadcrumbs a { text-decoration: none; }
    .breadcrumbs .sep { margin: 0 0.3rem; color: var(--text); opacity: 0.5; }
    .file-list { list-style: none; padding: 0; margin: 0; }
    .file-list li { border-bottom: 1px solid var(--border); }
    .file-list li a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.3rem;
      text-decoration: none;
    }
    .file-list li:hover { background: var(--hover-bg); }
    .file-list .size { color: var(--muted); font-size: 0.85em; margin-left: 1rem; white-space: nowrap; }
    .file-list .name { overflow: hidden; text-overflow: ellipsis; }
    .prose { margin-top: 1rem; line-height: 1.6; }
    .empty { color: var(--muted); font-style: italic; padding: 1rem 0; }
  </style>
</head>
<body>
  <button class="theme-toggle" id="theme-toggle" aria-label="toggle theme"></button>
  <div class="back-link"><a href="/">&larr; back</a></div>
  <h1>share</h1>
  <div class="breadcrumbs" id="breadcrumbs"></div>
  <div id="content"></div>
  <script>
    const FILE_TREE = {{FILE_TREE}};
    const md = window.markdownit({ html: true, linkify: true, breaks: true });
    const content = document.getElementById('content');
    const breadcrumbs = document.getElementById('breadcrumbs');

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function getNode(p) {
      if (!p || p === '/') return FILE_TREE;
      const parts = p.split('/').filter(Boolean);
      let node = FILE_TREE;
      for (const part of parts) {
        if (!node.children) return null;
        node = node.children.find(c => c.name === part);
        if (!node) return null;
      }
      return node;
    }

    function renderBreadcrumbs(p) {
      const parts = p.split('/').filter(Boolean);
      let html = '<a href="#/">share</a>';
      let acc = '';
      for (const part of parts) {
        acc += '/' + part;
        html += '<span class="sep">/</span><a href="#' + acc + '">' + part + '</a>';
      }
      breadcrumbs.innerHTML = html;
    }

    function renderDirectory(node, p) {
      renderBreadcrumbs(p);
      if (!node.children || node.children.length === 0) {
        content.innerHTML = '<p class="empty">empty directory</p>';
        return;
      }
      const sorted = [...node.children].sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      let html = '<ul class="file-list">';
      for (const child of sorted) {
        const childPath = (p === '' ? '' : p) + '/' + child.name;
        if (child.type === 'directory') {
          html += '<li><a href="#' + childPath + '"><span class="name">' + child.name + '/</span></a></li>';
        } else if (child.name.endsWith('.md')) {
          html += '<li><a href="#' + childPath + '"><span class="name">' + child.name + '</span><span class="size">' + formatSize(child.size) + '</span></a></li>';
        } else {
          html += '<li><a href="share' + childPath + '"><span class="name">' + child.name + '</span><span class="size">' + formatSize(child.size) + '</span></a></li>';
        }
      }
      html += '</ul>';
      content.innerHTML = html;
    }

    async function renderMarkdown(p) {
      renderBreadcrumbs(p);
      try {
        const resp = await fetch('share' + p);
        const text = await resp.text();
        const cleaned = text.replace(/^---\\n[\\s\\S]*?\\n---\\n*/, '');
        content.innerHTML = '<div class="prose">' + md.render(cleaned) + '</div>';
      } catch (e) {
        content.innerHTML = '<p>Failed to load file.</p>';
      }
    }

    function navigate() {
      const hash = decodeURIComponent(location.hash.slice(1)) || '/';
      const node = getNode(hash);
      if (!node) {
        content.innerHTML = '<p>Not found.</p>';
        renderBreadcrumbs(hash);
        return;
      }
      if (node.type === 'directory') {
        renderDirectory(node, hash === '/' ? '' : hash);
      } else if (node.name.endsWith('.md')) {
        renderMarkdown(hash);
      } else {
        window.location.href = 'share' + hash;
      }
    }

    window.addEventListener('hashchange', navigate);
    navigate();
  </script>
</body>
</html>`;

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const children = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      children.push({ name: entry.name, type: 'directory', children: scanDirectory(fullPath) });
    } else {
      children.push({ name: entry.name, type: 'file', size: fs.statSync(fullPath).size });
    }
  }
  return children;
}

function generateSharePage(tree) {
  return SHARE_TEMPLATE.replace('{{FILE_TREE}}', JSON.stringify(tree));
}

const posts = getPosts();

posts.forEach(post => {
  const htmlPath = path.join(POSTS_DIR, `${post.slug}.html`);
  fs.writeFileSync(htmlPath, generatePostHTML(post));
  console.log(`Generated ${htmlPath}`);
});

fs.writeFileSync('./feed.xml', generateRSS(posts));
updateIndex(posts);
console.log(`Built ${posts.length} posts`);

if (fs.existsSync(SHARE_DIR)) {
  const shareTree = { name: 'share', type: 'directory', children: scanDirectory(SHARE_DIR) };
  fs.writeFileSync('./share.html', generateSharePage(shareTree));
  console.log('Generated share.html');
}
