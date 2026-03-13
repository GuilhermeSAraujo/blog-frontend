import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { Post, getPostPreview, sortPostsByDate } from "../lib/types";

type HomePageProps = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    console.error("API_BASE_URL is not defined");
    return {
      props: {
        posts: [],
      },
      revalidate: 300,
    };
  }

  let posts: Post[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/post`);

    if (!res.ok) {
      console.error("Failed to fetch posts", res.status, res.statusText);
    } else {
      const data = (await res.json()) as Post[];
      if (Array.isArray(data)) {
        posts = sortPostsByDate(data);
      } else {
        console.error("Unexpected posts response shape", data);
      }
    }
  } catch (error) {
    console.error("Error fetching posts", error);
  }

  return {
    props: {
      posts,
    },
    revalidate: 300,
  };
};

export default function HomePage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const bg = "gray.50";
  const cardBg = "white";
  const muted = "gray.600";

  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Blog posts" />
      </Head>
      <Box bg={bg} minH="100vh" py={12}>
        <Container maxW="3xl">
          <Heading as="h1" size="2xl" mb={8}>
            Blog
          </Heading>

          {posts.length === 0 ? (
            <Text fontSize="lg" color={muted}>
              No posts found.
            </Text>
          ) : (
            <Stack gap={6}>
              {posts.map((post) => (
                <Box
                  as={Link}
                  href={`/${String(post.id)}`}
                  key={post.id}
                  bg={cardBg}
                  p={6}
                  rounded="lg"
                  shadow="sm"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ shadow: "md", borderColor: "gray.300" }}
                  transition="all 0.15s ease-out"
                >
                  <Heading as="h2" size="md" mb={2}>
                    {post.title}
                  </Heading>
                  {post.createdAt && (
                    <Text fontSize="sm" color={muted} mb={2}>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  )}
                  {getPostPreview(post) && (
                    <Text fontSize="md" color={muted}>
                      {getPostPreview(post)}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
}

