import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('content'));
  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(
      path.join('content', filename),
      'utf-8'
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    return { slug, frontmatter };
  });

  return {
    props: {
      posts: posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()),
    },
  };
}

export default function Home({ posts }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">lmn516 · 记录我想法的小角落</h1>
      <ul className="space-y-4">
        {posts.map(({ slug, frontmatter }) => (
          <li key={slug}>
            <Link href={`/posts/${slug}`} className="text-xl text-blue-600 hover:underline">
              {frontmatter.title}
            </Link>
            <p className="text-sm text-gray-500">{frontmatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
