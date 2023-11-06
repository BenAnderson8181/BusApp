import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const vehicleImageRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const vehicleImage = await ctx.db.vehicleImages.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    vehicle: true,
                }
            });

            if (!vehicleImage)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the vehicle image.'});

            return vehicleImage;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                filePath: z.string().min(2).max(100),
                vehicleId: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const vehicleImage = await ctx.db.vehicleImages.create({data: {...input}});

            if (!vehicleImage.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the vehicle image.' });

            return vehicleImage;
        }),
    list: protectedProcedure
        .input(
            z.object({
                vehicleId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const vehicleImages = await ctx.db.vehicleImages.findMany({
                where: {
                    vehicleId: input.vehicleId,
                    isActive: input.showInActive
                }
            })

            return vehicleImages;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const vehicleImage = await ctx.db.vehicleImages.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!vehicleImage.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate vehicle image.' });

            return vehicleImage;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                filePath: z.string().min(2).max(100),
                vehicleId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const vehicleImage = await ctx.db.vehicleImages.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!vehicleImage)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the vehicle image.' });

            return vehicleImage;
        })
});