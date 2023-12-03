import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const policyRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const policies = await ctx.db.policy.findMany();

            if (!policies)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any policies.' });

            return policies;
        }
    ),
})