import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

import phoneRegex from "~/utils/phoneValidation";

export const companyRouter = createTRPCRouter({
    findById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const account = await ctx.db.company.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    rates: true,
                    adjustments: true,
                    bookings: true,
                    payments: true,
                    vehicles: true
                }
            });

            if (!account)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load account.'});

            return account;
        }
    ),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(2).max(100),
                DOT: z.string().max(50).or(z.literal('')),
                address: z.string().min(4).max(100),
                city: z.string().min(2).max(50),
                state: z.string().min(2).max(2),
                zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
                country: z.string().min(2).max(50),
                email: z.string().email(),
                website: z.string().url().optional().or(z.literal('')),
                companyPhone: z.string().refine((value) => phoneRegex.test(value)),
                dispatchPhone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
                mobilePhone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
                ELDId: z.string().optional()
            })
        )
        .mutation(async ({ctx, input}) => {
            const company = await ctx.db.company.create({data: {...input}});

            if (!company.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create company.' });

            return company;
        }),
    list: protectedProcedure
        .input(
            z.object({
                showInActive: z.boolean().default(false)
            })
        )
        .query(async ({ ctx, input }) => {
            const companies = await ctx.db.company.findMany({
                where: {
                    IsActive: input.showInActive
                }
            })

            return companies;
        }),
    inActivate: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const company = await ctx.db.company.update({
                where: {
                    id: input.id
                },
                data: {
                    IsActive: false
                }
            });

            if (!company.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to inactivate company.' });

            return company;
        }),
    search: protectedProcedure
        .input(
            z.object({
                search: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.search.length < 2)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please send a longer search string to help find the company.'});

            const companies = await ctx.db.company.findMany({
                take: 5,
                where: {
                    OR: [
                        {
                            name: {
                                contains: input.search,
                            },
                        },
                        {
                            DOT: {
                                contains: input.search
                            }
                        }
                    ], 
                }
            });

            return companies;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(2).max(100),
                DOT: z.string().max(50).or(z.literal('')),
                address: z.string().min(4).max(100),
                city: z.string().min(2).max(50),
                state: z.string().min(2).max(2),
                zip: z.string().regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/),
                country: z.string().min(2).max(50),
                email: z.string().email(),
                website: z.string().url().optional().or(z.literal('')),
                companyPhone: z.string().refine((value) => phoneRegex.test(value)),
                dispatchPhone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
                mobilePhone: z.string().optional().refine((value) => phoneRegex.test(value ?? '')),
                ELDId: z.string().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const company = await ctx.db.company.update({
                where: { id: input.id },
                data: { ...input }
            });

            if (!company)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the company.' });

            return company;
        })
});