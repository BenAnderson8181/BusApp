import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const documentLogRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                url: z.string(),
                name: z.string(),
                key: z.string(),
                size: z.number(),
                action: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const documentLog = await ctx.db.documentLog.create({
                data: {
                    user: {
                        connect: {
                            id: input.userId,
                        },
                    },
                    url: input.url,
                    name: input.name,
                    key: input.key,
                    size: input.size,
                    action: input.action,
                },
            });

            if (!documentLog)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create a document log.' });

            return documentLog;
        }
    ),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                action: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const documentLog = await ctx.db.documentLog.update({
                where: {
                    id: input.id
                },
                data: {
                    action: input.action
                }
            });

            if (!documentLog)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update the document log.' });

            return documentLog;
        })
});