import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const requiredPoliciesRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const requiredPolicies = await ctx.db.requiredPolicy.findMany();

            if (!requiredPolicies)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find required policies.' });
                
            return requiredPolicies; 
        }
    ),
})