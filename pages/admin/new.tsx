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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        body: JSON.stringify({ title, content, "tag-ids": [] }),
      });
      if (res.status === 201) {
        await res.json().catch(() => ({})); // consume body; id available if needed
        router.push("/admin");
        return;
      }
      setError(res.statusText || "Failed to create post");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (isChecking || !isLoggedIn) {
    return null;
  }

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
