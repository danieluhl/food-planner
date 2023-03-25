import "@total-typescript/ts-reset";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { api } from "../utils/api";
import { useRouter } from "next/router";

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <>
          <SignedIn>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
