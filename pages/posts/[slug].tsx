import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownIt from 'markdown-it';

const md = new markdownIt();

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('content'));
  const paths = files.map((filename) => ({
    params: { slug: filename.replace('.md', '') },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(path.join('content', slug + '.md'), 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);
  const html = md.render(content);

  return {
    props: { frontmatter, slug, html },
  };
}

export default function PostPage({ frontmatter, html }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{frontmatter.date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
