import { SessionProvider } from "next-auth/react";
import { Component } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
