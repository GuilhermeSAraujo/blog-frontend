import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Container,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Post } from "../lib/types";

type PostPageProps = {
  post: Post | null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/post`);
    if (!res.ok) {
      return {
        paths: [],
        fallback: "blocking",
      };
    }
    const data = (await res.json()) as Post[];
    const posts = Array.isArray(data) ? data : [];

    const paths = posts.map((post) => ({
      params: { id: String(post.id) },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps<PostPageProps> = async (
  context
) => {
  const { params } = context;
  const id = params?.id;
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl || !id || typeof id !== "string") {
    return {
      notFound: true,
      revalidate: 300,
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/post`);
    if (!res.ok) {
      return {
        notFound: true,
        revalidate: 300,
      };
    }
    const data = (await res.json()) as Post[];
    const posts = Array.isArray(data) ? data : [];
    const post =
      posts.find((p) => String(p.id) === String(id)) ?? null;

    if (!post) {
      return {
        notFound: true,
        revalidate: 300,
      };
    }

    return {
      props: { post },
      revalidate: 300,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 300,
    };
  }
};

export default function PostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) {
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

  if (!post) {
    return null;
  }

  const bg = "gray.50";
  const muted = "gray.600";

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name="description"
          content={post.excerpt || undefined}
        />
      </Head>
      <Box bg={bg} minH="100vh" py={12}>
        <Container maxW="3xl">
          <Heading as="h1" size="2xl" mb={4}>
            {post.title}
          </Heading>
          {post.createdAt && (
            <Text fontSize="sm" color={muted} mb={6}>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          )}
          {post.content && (
            <Box fontSize="md" lineHeight="tall">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <Text mb={4}>{children}</Text>,
                  h1: ({ children }) => (
                    <Heading as="h2" size="xl" mt={8} mb={4}>
                      {children}
                    </Heading>
                  ),
                  h2: ({ children }) => (
                    <Heading as="h3" size="lg" mt={8} mb={3}>
                      {children}
                    </Heading>
                  ),
                  h3: ({ children }) => (
                    <Heading as="h4" size="md" mt={6} mb={2}>
                      {children}
                    </Heading>
                  ),
                  ul: ({ children }) => <Box as="ul" pl={6} mb={4}>{children}</Box>,
                  ol: ({ children }) => <Box as="ol" pl={6} mb={4}>{children}</Box>,
                  li: ({ children }) => <Box as="li" mb={1}>{children}</Box>,
                  a: ({ children, href }) => (
                    <Box
                      as="a"
                      href={href}
                      color="blue.600"
                      textDecoration="underline"
                      _hover={{ color: "blue.700" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {children}
                    </Box>
                  ),
                  code: ({ children }) => (
                    <Box
                      as="code"
                      px={1}
                      py={0.5}
                      bg="gray.100"
                      rounded="sm"
                      fontSize="0.95em"
                    >
                      {children}
                    </Box>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

