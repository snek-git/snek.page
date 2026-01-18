const fs = require('fs');
const path = require('path');

const POSTS_DIR = './posts';
const SITE_URL = 'https://snek.page';

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
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const meta = parseFrontmatter(content);
    if (!meta) return null;
    const slug = file.replace('.md', '');
    return { ...meta, slug, file };
  }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
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
    `  <p><a href="/posts/${p.slug}.html">${p.date} - ${p.title}</a></p>`
  ).join('\n');
}

function updateIndex(posts) {
  let html = fs.readFileSync('./index.html', 'utf-8');
  const blogLinks = generateBlogLinks(posts);
  html = html.replace(
    /(<h3>blog.*?<\/a><\/h3>\n)([\s\S]*?)(\n  <div class="corner-art">)/,
    `$1${blogLinks}$3`
  );
  fs.writeFileSync('./index.html', html);
}

const posts = getPosts();
fs.writeFileSync('./feed.xml', generateRSS(posts));
updateIndex(posts);
console.log(`Built ${posts.length} posts`);
