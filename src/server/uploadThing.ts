import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { getAuth } from "@clerk/nextjs/server";
 
const f = createUploadthing();

// Define as many FileRoutes as you like, each with a unique routeSlug
export const ourFileRouter = {
  // Set permissions and file types for this FileRoute
  imageUploader: f({ image: { maxFileSize: "4MB" }, text: { maxFileSize: "4MB" }, pdf: { maxFileSize: "4MB" }, blob: { maxFileSize: "4MB" } })
    .middleware(({ req }) => {
      const user = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!user)
        throw new Error("Unauthorized");

      if (!user.userId) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;