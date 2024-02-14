import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const rateRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const rate = await ctx.db.rate.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    company: true
                }
            });

            if (!rate)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the rate.'});

            return rate;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(100),
                transfer: z.number(),
                deadMile: z.number(),
                liveMile: z.number(),
                hourly: z.number(),
                minimumHours: z.number().int(),
                daily: z.number(),
                companyId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const rate = await ctx.db.rate.create({data: {...input}});

            if (!rate.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the rate.' });

            return rate;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const rates = await ctx.db.rate.findMany({
                where: {
                    companyId: input.companyId,
                    isActive: input.showInActive
                }
            })

            return rates;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const rate = await ctx.db.rate.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!rate.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the rate.' });

            return rate;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(2).max(100),
                transfer: z.number(),
                deadMile: z.number(),
                liveMile: z.number(),
                hourly: z.number(),
                minimumHours: z.number().int(),
                daily: z.number(),
                companyId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const rate = await ctx.db.rate.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!rate)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the rate.' });

            return rate;
        })
});