import { type AppType } from "next/app";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const isPublicPath = ['/'].includes(pathname);

  return (
    <ClerkProvider appearance={{
      signIn: {
        elements: {
          formButtonPrimary: {
            color: 'white',
            backgroundColor: '#391867',
            "&:hover": {
              backgroundColor: '#5e3893',
            },
          }
        },
      },
      variables: {
        colorPrimary: '#391867',
      }
    }}>
      {isPublicPath && (
        <Component {...pageProps} />
      )}
      {!isPublicPath && (
        <>
          <SignedIn>
            <Component {...pageProps} />
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
