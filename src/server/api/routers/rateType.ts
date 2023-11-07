import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const rateTypeRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const rateType = await ctx.db.rateType.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    adjustmentRateTypes: true
                }
            });

            if (!rateType)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the rate type.'});

            return rateType;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(100),
                companyId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const rateType = await ctx.db.rateType.create({data: {...input}});

            if (!rateType.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the rate type.' });

            return rateType;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const rateTypes = await ctx.db.rateType.findMany({
                where: {
                    companyId: input.companyId,
                    isActive: input.showInActive
                }
            })

            return rateTypes;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const rateType = await ctx.db.rateType.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!rateType.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the rate type.' });

            return rateType;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(2).max(100),
                companyId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const rateType = await ctx.db.rateType.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!rateType)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the rate type.' });

            return rateType;
        })
});