import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { getApiBaseUrl } from "../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("adminLoggedIn", "true");
        }
        router.push("/admin");
        return;
      }
      setError(res.status === 401 ? "Invalid credentials" : res.statusText);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <Box minH="100vh" py={12} bg="gray.50">
        <Container maxW="md">
          <Heading size="lg" mb={6}>
            Admin Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <Field.Root required mb={4}>
              <Field.Label>Username</Field.Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </Field.Root>
            <Field.Root required mb={4}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field.Root>
            {error && (
              <Text color="red.500" mb={4}>
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="blue" loading={loading}>
              Log in
            </Button>
          </form>
        </Container>
      </Box>
    </>
  );
}
