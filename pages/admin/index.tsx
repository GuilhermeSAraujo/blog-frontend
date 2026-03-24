import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getApiBaseUrl } from "../../lib/api";
import { useAdminAuth } from "../../lib/useAdminAuth";
import { Post, postFromWire, sortPostsByDate } from "../../lib/types";

export default function AdminListPage() {
  const router = useRouter();
  const { isChecking, isLoggedIn } = useAdminAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`${getApiBaseUrl()}/api/post`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: Record<string, unknown>[]) => {
        if (!cancelled)
          setPosts(
            sortPostsByDate(
              Array.isArray(data) ? data.map(postFromWire) : []
            )
          );
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load posts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (isChecking || !isLoggedIn) {
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

  return (
    <>
      <Head>
        <title>Admin – Posts</title>
      </Head>
      <Box minH="100vh" py={12} bg="gray.50">
        <Container maxW="3xl">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={6}
          >
            <Heading size="lg">Admin – Posts</Heading>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("adminLoggedIn");
                }
                router.push("/admin/login");
              }}
            >
              Log out
            </Button>
          </Box>
          <Button asChild colorScheme="blue" mb={6}>
            <Link href="/admin/new">New post</Link>
          </Button>
          {error && (
            <Text color="red.500" mb={4}>
              {error}
            </Text>
          )}
          {loading ? (
            <Spinner />
          ) : posts.length === 0 ? (
            <Text color="gray.600">No posts yet.</Text>
          ) : (
            <Stack gap={4}>
              {posts.map((post) => (
                <Box
                  key={post.slug}
                  p={4}
                  bg="white"
                  rounded="md"
                  borderWidth="1px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Text fontWeight="medium">{post.title}</Text>
                    {post.publishedAt && (
                      <Text fontSize="sm" color="gray.500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </Box>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/${encodeURIComponent(post.slug)}`}>
                      Edit
                    </Link>
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
}
