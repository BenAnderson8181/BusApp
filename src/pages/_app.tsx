import { type AppType } from "next/app";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { dark } from '@clerk/themes';

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const isPublicPath = ['/', '/about-us', '/blog', '/careers', '/get-quote', '/inc', '/operators', '/rentals', '/shuttles'].includes(pathname); // also need to set public paths in middleware.ts

  return (
    <ClerkProvider appearance={{
      // signIn: {
      //   elements: {
      //     formButtonPrimary: {
      //       color: 'white',
      //       backgroundColor: '#333',
      //       "&:hover": {
      //         backgroundColor: '#111',
      //       },
      //     }
      //   },
      // },
      // variables: {
      //   colorPrimary: '#000',
      // }
      baseTheme: dark
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
