import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const bookingDriverRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const bookingDriver = await ctx.db.bookingDriver.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    booking: true,
                    user: true
                }
            });

            if (!bookingDriver)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the booking driver.'});

            return bookingDriver;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                bookingId: z.string(),
                userId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const bookingDriver = await ctx.db.bookingDriver.create({data: {...input}});

            if (!bookingDriver.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the booking driver.' });

            return bookingDriver;
        }),
    list: protectedProcedure
        .input(
            z.object({
                bookingId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const bookingDrivers = await ctx.db.bookingDriver.findMany({
                where: {
                    bookingId: input.bookingId
                }
            })

            return bookingDrivers;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                bookingId: z.string(),
                userId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const bookingDriver = await ctx.db.bookingDriver.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!bookingDriver)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the booking driver.' });

            return bookingDriver;
        })
});