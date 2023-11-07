import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const adjustmentDayRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const adjustmentDay = await ctx.db.adjustmentDay.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    adjustment: true,
                    day: true
                }
            });

            if (!adjustmentDay)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the adjustment day.'});

            return adjustmentDay;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                adjustmentId: z.string(),
                dayId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const adjustmentDay = await ctx.db.adjustmentDay.create({data: {...input}});

            if (!adjustmentDay.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the adjustment day.' });

            return adjustmentDay;
        }),
    list: protectedProcedure
        .input(
            z.object({
                adjustmentId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const adjustmentDay = await ctx.db.adjustmentDay.findMany({
                where: {
                    adjustmentId: input.adjustmentId,
                    isActive: input.showInActive
                }
            })

            return adjustmentDay;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const adjustmentDay = await ctx.db.adjustmentDay.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!adjustmentDay.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the adjustment day.' });

            return adjustmentDay;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                adjustmentId: z.string(),
                dayId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const adjustmentDay = await ctx.db.adjustmentDay.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!adjustmentDay)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the adjustment day.' });

            return adjustmentDay;
        })
});