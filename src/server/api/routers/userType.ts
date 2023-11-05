import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const userTypes = await ctx.db.userType.findMany();

            if (!userTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find user types.' });
                
            return userTypes;
        })
});