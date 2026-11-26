import Link from 'next/link';

export default function BlogIndex() {
  const posts = [
    {
      slug: "the-ultimate-guide-to-ai-automation-for-b2b-enterprises",
      title: "The Ultimate Guide to AI Automation for B2B Enterprises",
      excerpt: "Learn how artificial intelligence is transforming B2B workflows, reducing costs, and increasing operational efficiency in 2026.",
      date: "September 25, 2026",
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-black mb-12 font-heading">Latest Insights</h1>
      <div className="grid gap-8">
        {posts.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="block p-8 rounded-[2rem] bg-foreground/5 border border-foreground/10 hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="text-primary text-sm font-bold tracking-widest uppercase mb-4">{post.date}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">{post.title}</h2>
            <p className="text-foreground/70 leading-relaxed text-lg">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
