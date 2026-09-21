import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isEditorialRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isEditorialRoute(req)) {
      await auth.protect();
    }
  },
  () => ({
    jwtKey: process.env.CLERK_JWT_KEY,
  })
);

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
