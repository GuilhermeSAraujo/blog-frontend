import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { Box, chakra, Container, Heading, Stack, Text } from "@chakra-ui/react";

const PostCardLink = chakra(Link);
import {
  Post,
  postFromWire,
  getPostPreview,
  sortPostsByDate,
} from "../lib/types";

type HomePageProps = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    console.error("API_BASE_URL is not defined");
    return { props: { posts: [] }, revalidate: 300 };
  }

  let posts: Post[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/post`);
    if (!res.ok) {
      console.error("Failed to fetch posts", res.status, res.statusText);
    } else {
      const data = (await res.json()) as Record<string, unknown>[];
      if (Array.isArray(data)) {
        posts = sortPostsByDate(data.map(postFromWire));
      } else {
        console.error("Unexpected posts response shape", data);
      }
    }
  } catch (error) {
    console.error("Error fetching posts", error);
  }

  return { props: { posts }, revalidate: 300 };
};

export default function HomePage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Blog posts" />
      </Head>
      <Box bg="bg.subtle" minH="100vh" py={12}>
        <Container maxW="3xl">
          <Heading as="h1" size="2xl" mb={8}>
            Blog
          </Heading>

          {posts.length === 0 ? (
            <Text fontSize="lg" color="fg.muted">
              No posts found.
            </Text>
          ) : (
            <Stack gap={6}>
              {posts.map((post) => (
                <PostCardLink
                  href={`/${encodeURIComponent(post.slug)}`}
                  key={post.slug}
                  bg="bg.panel"
                  p={6}
                  rounded="lg"
                  shadow="sm"
                  borderWidth="1px"
                  borderColor="border"
                  _hover={{ shadow: "md", borderColor: "border.emphasized" }}
                  transition="all 0.15s ease-out"
                >
                  <Heading as="h2" size="md" mb={2}>
                    {post.title}
                  </Heading>
                  {post.publishedAt && (
                    <Text fontSize="sm" color="fg.muted" mb={2}>
                      {new Date(post.publishedAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  )}
                  {getPostPreview(post) && (
                    <Text fontSize="md" color="fg.muted">
                      {getPostPreview(post)}
                    </Text>
                  )}
                </PostCardLink>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
}
