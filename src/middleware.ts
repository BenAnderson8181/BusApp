import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ['/', '/about-us', '/blog', '/careers', '/get-quote', '/inc', '/operators', '/rentals', '/shuttles'], // Note we also have a publicPaths check in _app.tsx
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/",  "/(api|trpc)(.*)"],
};