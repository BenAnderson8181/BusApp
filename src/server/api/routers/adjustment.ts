import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const adjustmentRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const adjustment = await ctx.db.adjustment.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    company: true,
                    vehicleType: true,
                    adjustmentDays: true,
                    adjustmentRateTypes: true
                }
            });

            if (!adjustment)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the adjustment.'});

            return adjustment;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(100),
                startDate: z.date(),
                endDate: z.date(),
                companyId: z.string(),
                vehicleTypeId: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const adjustment = await ctx.db.adjustment.create({data: {...input}});

            if (!adjustment.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the adjustment.' });

            return adjustment;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const adjustments = await ctx.db.adjustment.findMany({
                where: {
                    companyId: input.companyId,
                    isActive: input.showInActive
                }
            })

            return adjustments;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const adjustment = await ctx.db.adjustment.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!adjustment.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the adjustment.' });

            return adjustment;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(2).max(100),
                startDate: z.date(),
                endDate: z.date(),
                companyId: z.string(),
                vehicleTypeId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const adjustment = await ctx.db.adjustment.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!adjustment)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the adjustment.' });

            return adjustment;
        })
});