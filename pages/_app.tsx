import type { AppProps } from "next/app";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "../components/ColorModeProvider";
import { ColorModeToggle } from "../components/ColorModeToggle";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <ColorModeToggle />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

