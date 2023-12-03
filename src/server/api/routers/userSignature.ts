import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const userSignatureRouter = createTRPCRouter({
    upsert: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                signature: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id: input.userId,
                },
            });

            if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find user to update the signature for.' });

            const userSignature = await ctx.db.userSignature.upsert({
                where: {
                    userId: input.userId,
                },
                update: {
                    signature: input.signature,
                },
                create: {
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    signature: input.signature,
                }
            });

            if (!userSignature.id) 
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update user signature.' });

            return userSignature;
        }
    ),
    load: protectedProcedure
        .input(
            z.object({
                externalId: z.string().optional(),
                userId: z.string().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            if (!input.userId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Request did not pass in an id.' });

            let userId = input.userId;
            if (!userId) {
                const user = await ctx.db.user.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!user)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load user from external id.'  });

                userId = user.id;
            }

            const user = await ctx.db.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (!user) 
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find user for the signature.' });

            const userSignature = await ctx.db.userSignature.findUnique({
                where: {
                    userId: user.id,
                },
            });

            if (!userSignature) 
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find a signature.' });

            return userSignature;
        }
    ),
});