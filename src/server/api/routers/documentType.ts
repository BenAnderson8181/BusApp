import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const documentTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ ctx }) => {
            const documentTypes = await ctx.db.documentType.findMany();

            if (!documentTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find document types.' });
                
            return documentTypes;
        })
})