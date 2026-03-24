import { Head, Html, Main, NextScript } from "next/document";
import { COLOR_MODE_STORAGE_KEY } from "../lib/colorModeStorage";

const syncColorSchemeScript = `(function(){try{var k=${JSON.stringify(
  COLOR_MODE_STORAGE_KEY
)};var v=localStorage.getItem(k);if(v==="light"||v==="dark"){document.documentElement.style.colorScheme=v;var m=document.querySelector('meta[name="color-scheme"]');if(m)m.setAttribute("content",v);}}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en" style={{ colorScheme: "dark" }}>
      <Head>
        <meta name="color-scheme" content="dark" />
        <script dangerouslySetInnerHTML={{ __html: syncColorSchemeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
