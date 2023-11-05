import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const dayRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const days = await ctx.db.day.findMany();

            if (!days)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find days.' });
                
            return days;
        })
});