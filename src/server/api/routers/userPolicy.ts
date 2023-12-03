import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const userPolicyRouter = createTRPCRouter({
    upsert: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                policyId: z.string(),
                signed: z.boolean(),
                rejected: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userPolicy = await ctx.db.userPolicy.findFirst({
                where: {
                    userId: input.userId,
                    policyId: input.policyId,
                },
            });

            if (userPolicy) {
                const updatedUserPolicy = await ctx.db.userPolicy.update({
                    where: {
                        id: userPolicy.id,
                    },
                    data: {
                        signed: input.signed,
                        rejected: input.rejected ?? false
                    },
                });

                if (!updatedUserPolicy)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update policy.' });

                return updatedUserPolicy;
            }

            const createdUserPolicy = await ctx.db.userPolicy.create({
                data: {
                    user: {
                        connect: {
                            id: input.userId,
                        },
                    },
                    policy: {
                        connect: {
                            id: input.policyId,
                        },
                    },
                    signed: input.signed,
                    rejected: input.rejected ?? false
                },
            });

            if (!createdUserPolicy)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create policy.' });

            return createdUserPolicy;
        }
    ),
    list: protectedProcedure
        .input(
            z.object({
                userId: z.string().optional(),
                externalId: z.string().optional()
            })
        )
        .query(async ({ctx, input}) => {
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

             const userPolicies = await ctx.db.userPolicy.findMany({
                where: {
                    userId: userId
                },
                include: {
                    policy: true
                }
            });

            if (!userPolicies)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find any user policies.' });
                
            return userPolicies;
        }
    ),
});
    