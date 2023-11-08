import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const bidRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const bid = await ctx.db.bid.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    booking: true
                }
            });

            if (!bid)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the bid.'});

            return bid;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                customerId: z.string(),
                bookingId: z.string(),
                averageAmount: z.number(),
                acceptedAmount: z.number()
            })
        )
        .mutation(async ({ctx, input}) => {
            const bid = await ctx.db.bid.create({data: {...input}});

            if (!bid.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the bid.' });

            return bid;
        }),
    list: protectedProcedure
        .query(async ({ ctx }) => {
            const bid = await ctx.db.bid.findMany();

            return bid;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                customerId: z.string(),
                bookingId: z.string(),
                averageAmount: z.number(),
                acceptedAmount: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const bid = await ctx.db.bid.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!bid)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the bid.' });

            return bid;
        })
});