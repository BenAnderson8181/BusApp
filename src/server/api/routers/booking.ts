import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const bookingRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const booking = await ctx.db.booking.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    bookingStatus: true,
                    bookingVehicles: true,
                    company: true,
                    bookingDetails: true,
                    bookingDrivers: true,
                    bids: true
                }
            });

            if (!booking)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the booking.'});

            return booking;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                customerId: z.string(),
                bookingStatusId: z.string(),
                companyId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const booking = await ctx.db.booking.create({data: {...input}});

            if (!booking.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the booking.' });

            return booking;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const bookings = await ctx.db.booking.findMany({
                where: {
                    companyId: input.companyId
                }
            })

            return bookings;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                customerId: z.string(),
                bookingStatusId: z.string(),
                companyId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const booking = await ctx.db.booking.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!booking)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the booking.' });

            return booking;
        })
});