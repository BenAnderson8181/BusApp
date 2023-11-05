import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const vehicleTypeRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ctx}) => {
            const vehicleTypes = await ctx.db.vehicleType.findMany();

            if (!vehicleTypes)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find vehicle types.' });
                
            return vehicleTypes;
        })
});