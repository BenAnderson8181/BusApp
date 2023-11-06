import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const garageRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const garage = await ctx.db.garage.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    company: true,
                    vehicles: true
                }
            });

            if (!garage)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the garage.'});

            return garage;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(100),
                address: z.string().min(2).max(100),
                city: z.string().min(2).max(50),
                state: z.string().min(2).max(2),
                zip: z.string().min(2).max(15),
                companyId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ctx, input}) => {
            const garage = await ctx.db.garage.create({data: {...input}});

            if (!garage.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the garage.' });

            return garage;
        }),
    list: protectedProcedure
        .input(
            z.object({
                companyId: z.string(),
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const garages = await ctx.db.garage.findMany({
                where: {
                    companyId: input.companyId,
                    isActive: input.showInActive
                }
            })

            return garages;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const garage = await ctx.db.garage.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!garage.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the garage.' });

            return garage;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(2).max(100),
                address: z.string().min(2).max(100),
                city: z.string().min(2).max(50),
                state: z.string().min(2).max(2),
                zip: z.string().min(2).max(15),
                companyId: z.string(),
                isActive: z.boolean().default(true)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const garage = await ctx.db.garage.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!garage)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the garage.' });

            return garage;
        })
});