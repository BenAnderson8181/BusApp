import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";

import phoneRegex from "~/utils/phoneValidation";

export const userRouter = createTRPCRouter({
    findAccountByExternalId: publicProcedure
        .input(
            z.object({
                externalId: z.string()
            })
        )
        .query(async ({ctx, input}) => {
            const account = await ctx.db.user.findUnique({
                where: {
                    externalId: input.externalId
                },
                include: {
                    userType: true
                }
            });

            return account;
        }
    ),
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    userType: true,
                    userVehiclesTypes: true,
                    bookingDrivers: true,
                    company: true
                }
            });

            if (!user)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load the user.'});

            return user;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                externalId: z.string(),
                firstName: z.string().min(2).max(50),
                lastName: z.string().min(2).max(50),
                email: z.string().email(),
                userTypeId: z.string(),
                isDriver: z.boolean().default(false),
                phone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
                drugTestNumber: z.string().optional(),
                drugTestExpirationMonth: z.string().optional(),
                drugTestExpirationYear: z.number().int().optional(),
                licenseNumber: z.string().optional(),
                stateId: z.string().optional(),
                licenseExpirationMonth: z.string().optional(),
                licenseExpirationYear: z.number().optional(),
                notes: z.string().optional(),
                companyId: z.string().optional(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const user = await ctx.db.user.create({data: {...input, isActive: true }});

            if (!user.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create the user.' });

            return user;
        }),
    list: protectedProcedure
        .input(
            z.object({
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const users = await ctx.db.user.findMany({
                where: {
                    isActive: input.showInActive
                }
            })

            return users;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const user = await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    isActive: false
                }
            });

            if (!user.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate the user.' });

            return user;
        }),
    search: protectedProcedure
        .input(
            z.object({
                search: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.search.length < 2)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please send a longer search string to help find the user.'});

            let firstName = '';
            let lastName = '';

            if (input.search.includes(' ')) {
                firstName = input.search.split(' ')[0] ?? '';
                lastName = input.search.split(' ')[1] ?? '';
            }
            else {
                firstName = input.search;
                lastName = input.search;
            }

            const users = await ctx.db.user.findMany({
                take: 5,
                where: {
                    OR: [
                        {
                            firstName: {
                                contains: firstName,
                            },
                        },
                        {
                            lastName: {
                                contains: lastName
                            }
                        }
                    ], 
                }
            });

            return users;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                externalId: z.string().optional(),
                firstName: z.string().min(2).max(50),
                lastName: z.string().min(2).max(50),
                email: z.string().email(),
                userTypeId: z.string(),
                isDriver: z.boolean(),
                phone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
                drugTestNumber: z.string().optional(),
                drugTestExpirationMonth: z.string().optional(),
                drugTestExpirationYear: z.number().int().optional(),
                licenseNumber: z.string().optional(),
                stateId: z.string(),
                licenseExpirationMonth: z.string().optional(),
                licenseExpirationYear: z.number().optional(),
                notes: z.string().optional(),
                companyId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!user)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the user.' });

            return user;
        }),
    updateCompanyId: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                companyId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.update({
                where: { id: input.id },
                data: {
                    companyId: input.companyId
                }
            });

            if (!user)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save the compnay id on the user.' });

            return user;
        })
});