import { useEffect, useState } from "react";
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
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { getApiBaseUrl } from "../../lib/api";
import { useAdminAuth } from "../../lib/useAdminAuth";
import { Post, postFromWire, postEditsToWire } from "../../lib/types";

export default function AdminEditPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { isChecking, isLoggedIn } = useAdminAuth();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !slug || typeof slug !== "string") return;
    let cancelled = false;
    fetch(`${getApiBaseUrl()}/api/post/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res.status === 404) throw new Error("not-found");
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((raw: Record<string, unknown>) => {
        if (cancelled) return;
        const found = postFromWire(raw);
        setPost(found);
        setTitle(found.title);
        setContent(found.content ?? "");
      })
      .catch((e: Error) => {
        if (!cancelled) setPost(e.message === "not-found" ? null : null);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (post == null || slug == null || typeof slug !== "string") return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${getApiBaseUrl()}/api/post/${encodeURIComponent(slug)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postEditsToWire({ title, content })),
        }
      );
      if (res.status === 200) {
        router.push("/admin");
        return;
      }
      if (res.status === 404) {
        setError("Post not found");
        return;
      }
      setError(res.statusText || "Failed to update post");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (isChecking || !isLoggedIn) return null;

  if (post === undefined) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    );
  }

  if (post === null) {
    return (
      <>
        <Head>
          <title>Post not found</title>
        </Head>
        <Box minH="100vh" py={12} bg="bg.subtle">
          <Container maxW="2xl">
            <Heading size="lg" mb={4}>
              Post not found
            </Heading>
            <Button asChild>
              <Link href="/admin">Back to list</Link>
            </Button>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit: {post.title}</title>
      </Head>
      <Box minH="100vh" py={12} bg="bg.subtle">
        <Container maxW="2xl">
          <Heading size="lg" mb={6}>
            Edit post
          </Heading>
          <form onSubmit={handleSubmit}>
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
            {error && (
              <Text color="fg.error" mb={4}>
                {error}
              </Text>
            )}
            <Stack direction="row" gap={2}>
              <Button type="submit" colorScheme="blue" loading={loading}>
                Save
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
