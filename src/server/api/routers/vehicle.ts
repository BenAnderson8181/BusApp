import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const vehicleRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const vehicle = await ctx.db.vehicle.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    vehicleType: true,
                    bookingVehicles: true,
                    images: true,
                    garage: true
                }
            });

            if (!vehicle)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the vehicle.'});

            return vehicle;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(100),
                vehicleTypeId: z.string(),
                make: z.string().min(2).max(100),
                model: z.string().min(2).max(100),
                year: z.number().int(),
                capacity: z.number().int(),
                vinNumber: z.string().min(2).max(50),
                licensePlate: z.string().min(2).max(50),
                garageId: z.string().optional(),
                wifi: z.boolean(),
                bathroom: z.boolean(),
                ADACompliant: z.boolean(),
                Outlets: z.boolean(),
                alcoholAllowed: z.boolean(),
                luggage: z.boolean(),
                seatBelts: z.boolean(),
                TVScreens: z.boolean(),
                leatherSeats: z.boolean(),
                companyId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ctx, input}) => {
            const vehicle = await ctx.db.vehicle.create({data: {...input}});

            if (!vehicle.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the vehicle.' });

            return vehicle;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const vehicles = await ctx.db.vehicle.findMany({
                where: {
                    companyId: input.companyId,
                    isActive: !input.showInActive
                }
            })

            return vehicles;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const vehicle = await ctx.db.vehicle.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!vehicle.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate vehicle.' });

            return vehicle;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(2).max(100),
                vehicleTypeId: z.string(),
                make: z.string().min(2).max(100),
                model: z.string().min(2).max(100),
                year: z.number().int(),
                capacity: z.number().int(),
                vinNumber: z.string().min(2).max(50),
                licensePlate: z.string().min(2).max(50),
                garageId: z.string().optional(),
                wifi: z.boolean(),
                bathroom: z.boolean(),
                ADACompliant: z.boolean(),
                Outlets: z.boolean(),
                alcoholAllowed: z.boolean(),
                luggage: z.boolean(),
                seatBelts: z.boolean(),
                TVScreens: z.boolean(),
                leatherSeats: z.boolean(),
                companyId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const vehicle = await ctx.db.vehicle.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!vehicle)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the vehicle.' });

            return vehicle;
        })
});