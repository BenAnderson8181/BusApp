import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const bookingStatusRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const bookingStatuses = await ctx.db.bookingStatus.findMany();

            if (!bookingStatuses)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find booking statuses.' });
                
            return bookingStatuses;
        })
});