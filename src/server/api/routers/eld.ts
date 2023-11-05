import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const eldRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const elds = await ctx.db.eLD.findMany();

            if (!elds)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find ELDs.' });
                
            return elds;
        })
});