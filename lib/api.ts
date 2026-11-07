/** Clojure API origin used by the server and by Next rewrites. Never sent to the browser. */
export function getServerApiBaseUrl(): string {
  return (process.env.API_BASE_URL ?? "").replace(/\/$/, "");
}

/** Same-origin path. Next proxies `/api/*` and `/feed.xml` to `API_BASE_URL`. */
export function apiPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
