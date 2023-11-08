import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const bookingDetailRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const bookingDetail = await ctx.db.bookingDetail.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    booking: true
                }
            });

            if (!bookingDetail)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the booking detail.'});

            return bookingDetail;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                bookingId: z.string(),
                startAddress: z.string().min(2).max(100),
                startCity: z.string().min(2).max(50),
                startState: z.string().min(2).max(2),
                startZip: z.string().min(2).max(15),
                endAddress: z.string().min(2).max(100),
                endCity: z.string().min(2).max(50),
                endState: z.string().min(2).max(2),
                endZip: z.string().min(2).max(15),
                spotTime: z.date(),
                pickupTime: z.date(),
                estimatedArrival: z.date(),
                totalMiles: z.number(),
                passengers: z.number().int()
            })
        )
        .mutation(async ({ctx, input}) => {
            const bookingDetail = await ctx.db.bookingDetail.create({data: {...input}});

            if (!bookingDetail.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the booking detail.' });

            return bookingDetail;
        }),
    list: protectedProcedure
        .input(
            z.object({
                bookingId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const bookingDetail = await ctx.db.bookingDetail.findMany({
                where: {
                    bookingId: input.bookingId
                }
            })

            return bookingDetail;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                bookingId: z.string(),
                startAddress: z.string().min(2).max(100),
                startCity: z.string().min(2).max(50),
                startState: z.string().min(2).max(2),
                startZip: z.string().min(2).max(15),
                endAddress: z.string().min(2).max(100),
                endCity: z.string().min(2).max(50),
                endState: z.string().min(2).max(2),
                endZip: z.string().min(2).max(15),
                spotTime: z.date(),
                pickupTime: z.date(),
                estimatedArrival: z.date(),
                totalMiles: z.number(),
                passengers: z.number().int()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const bookingDetail = await ctx.db.bookingDetail.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!bookingDetail)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the booking detail.' });

            return bookingDetail;
        })
});