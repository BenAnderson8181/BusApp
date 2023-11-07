import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const userVehicleTypeRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                vehicleTypeId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const userVehicleType = await ctx.db.userVehicleType.create({data: {...input}});

            if (!userVehicleType.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the user vehicle type.' });

            return userVehicleType;
        }),
    list: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const userVehicleTypes = await ctx.db.userVehicleType.findMany({
                where: {
                    userId: input.userId,
                    isActive: input.showInActive
                }
            })

            return userVehicleTypes;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const userVehicleType = await ctx.db.userVehicleType.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!userVehicleType.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the user vehicle type.' });

            return userVehicleType;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                userId: z.string(),
                showInActive: z.boolean().default(false),
                isActive: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userVehicleType = await ctx.db.userVehicleType.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!userVehicleType)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the user vehicle type.' });

            return userVehicleType;
        })
});