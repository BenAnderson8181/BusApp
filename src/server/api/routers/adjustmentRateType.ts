import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const adjustmentRateTypeRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const adjustmentRateType = await ctx.db.adjustmentRateType.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    rateType: true,
                    adjustment: true
                }
            });

            if (!adjustmentRateType)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the adjustment rate type.'});

            return adjustmentRateType;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                rateTypeId: z.string(),
                adjustmentId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const adjustmentRateType = await ctx.db.adjustmentRateType.create({data: {...input}});

            if (!adjustmentRateType.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the adjustment rate type.' });

            return adjustmentRateType;
        }),
    list: protectedProcedure
        .input(
            z.object({
                adjustmentId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const adjustmentRateTypes = await ctx.db.adjustmentRateType.findMany({
                where: {
                    adjustmentId: input.adjustmentId,
                    isActive: input.showInActive
                }
            })

            return adjustmentRateTypes;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const adjustmentRateType = await ctx.db.adjustmentRateType.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!adjustmentRateType.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the adjustment rate type.' });

            return adjustmentRateType;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                rateTypeId: z.string(),
                adjustmentId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const adjustmentRateType = await ctx.db.adjustmentRateType.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!adjustmentRateType)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the adjustment rate type.' });

            return adjustmentRateType;
        })
});