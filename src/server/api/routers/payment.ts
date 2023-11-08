import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const paymentRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const payment = await ctx.db.payment.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    company: true,
                    paymentStatus: true
                }
            });

            if (!payment)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the payment.'});

            return payment;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
                paymentStatusId: z.string(),
                initialPrice: z.number(),
                paidOut: z.number()
            })
        )
        .mutation(async ({ctx, input}) => {
            const payment = await ctx.db.payment.create({data: {...input}});

            if (!payment.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the payment.' });

            return payment;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const payments = await ctx.db.payment.findMany({
                where: {
                    companyId: input.companyId
                }
            })

            return payments;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                companyId: z.string(),
                paymentStatusId: z.string(),
                initialPrice: z.number(),
                paidOut: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const payment = await ctx.db.payment.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!payment)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the payment.' });

            return payment;
        })
});