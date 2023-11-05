import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const paymentStatusRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const paymentStatuses = await ctx.db.paymentStatus.findMany();

            if (!paymentStatuses)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find payment statuses.' });
                
            return paymentStatuses;
        })
});