export interface Post {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
}

export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });
}

export function getPostPreview(post: Post, maxWords = 10): string {
  const source = (post.excerpt || post.content || "").trim();
  if (!source) return "";
  const words = source.split(/\s+/);
  if (words.length <= maxWords) {
    return words.join(" ");
  }
  const sliced = words.slice(0, maxWords).join(" ");
  return `${sliced} ...`;
}


