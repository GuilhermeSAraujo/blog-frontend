import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { getApiBaseUrl } from "../../lib/api";
import { useAdminAuth } from "../../lib/useAdminAuth";

export default function AdminNewPostPage() {
  const router = useRouter();
  const { isChecking, isLoggedIn } = useAdminAuth();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [draft, setDraft] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          content,
          tags: [],
          "published-at": publishedAt,
          "draft?": draft,
        }),
      });
      if (res.status === 201) {
        const body = await res.json().catch(() => ({}));
        const createdSlug = body.slug ?? slug;
        router.push(`/admin/${encodeURIComponent(createdSlug)}`);
        return;
      }
      setError(res.statusText || "Failed to create post");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (isChecking || !isLoggedIn) return null;

  return (
    <>
      <Head>
        <title>New post</title>
      </Head>
      <Box minH="100vh" py={12} bg="gray.50">
        <Container maxW="2xl">
          <Heading size="lg" mb={6}>
            New post
          </Heading>
          <form onSubmit={handleSubmit}>
            <Field.Root required mb={4}>
              <Field.Label>Slug</Field.Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-post-slug"
              />
            </Field.Root>
            <Field.Root required mb={4}>
              <Field.Label>Title</Field.Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
              />
            </Field.Root>
            <Field.Root required mb={4}>
              <Field.Label>Content</Field.Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Post content"
                rows={12}
              />
            </Field.Root>
            <Field.Root mb={4}>
              <Field.Label>Publish date</Field.Label>
              <Input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </Field.Root>
            <Field.Root mb={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  id="draft-checkbox"
                  type="checkbox"
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <Field.Label htmlFor="draft-checkbox" mb={0}>
                  Save as draft
                </Field.Label>
              </Box>
            </Field.Root>
            {error && (
              <Text color="red.500" mb={4}>
                {error}
              </Text>
            )}
            <Stack direction="row" gap={2}>
              <Button type="submit" colorScheme="blue" loading={loading}>
                Create
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin">Cancel</Link>
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </>
  );
}
