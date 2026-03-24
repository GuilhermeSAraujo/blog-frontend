export interface Post {
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  tags: string[];
  publishedAt: string;
  draft: boolean;
  readingTime?: number;
}

export function postFromWire(json: Record<string, unknown>): Post {
  return {
    slug: String(json.slug ?? ""),
    title: String(json.title ?? ""),
    content: json.content != null ? String(json.content) : undefined,
    tags: Array.isArray(json.tags) ? json.tags.map(String) : [],
    publishedAt: String(json["published-at"] ?? ""),
    draft: Boolean(json["draft?"]),
    readingTime:
      typeof json["reading-time"] === "number"
        ? json["reading-time"]
        : undefined,
  };
}

export function postEditsToWire(updates: {
  title?: string;
  content?: string;
  tags?: string[];
  publishedAt?: string;
  draft?: boolean;
}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (updates.title !== undefined) out.title = updates.title;
  if (updates.content !== undefined) out.content = updates.content;
  if (updates.tags !== undefined) out.tags = updates.tags;
  if (updates.publishedAt !== undefined)
    out["published-at"] = updates.publishedAt;
  if (updates.draft !== undefined) out["draft?"] = updates.draft;
  return out;
}

export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const aTime = Date.parse(a.publishedAt || "");
    const bTime = Date.parse(b.publishedAt || "");
    return bTime - aTime;
  });
}

export function getPostPreview(post: Post, maxWords = 10): string {
  const source = (post.excerpt || post.content || "").trim();
  if (!source) return "";
  const words = source.split(/\s+/);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")} ...`;
}
