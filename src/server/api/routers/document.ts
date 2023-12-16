import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { useUser } from "@clerk/nextjs";

export const documentRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                documentTypeId: z.string(),
                url: z.string(),
                name: z.string(),
                key: z.string(),
                size: z.number()
            })
        )
        .mutation(async ({ctx, input}) => {
            const document = await ctx.db.document.create({
                data: {
                    user: {
                        connect: {
                            id: input.userId
                        }
                    },
                    url: input.url,
                    name: input.name,
                    key: input.key,
                    size: input.size,
                    documentType: {
                        connect: {
                            id: input.documentTypeId
                        }
                    }
                }
            });

            if (!document)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create document record.' });

            return document;
        }
    ),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const document = await ctx.db.document.delete({
                where: {
                    id: input.id
                }
            });

            if (!document.id)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete document record.' });

            return document;
        }
    ),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                userId: z.string()
            })
        )
        .query(async ({ctx, input}) => {
            const document = await ctx.db.document.findUnique({
                where: {
                    id: input.id
                }
            });

            if (!document)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find a document record for this request.' });

            // if the document is not associated with the account making the request, throw an error
            // unless the user is staff
            const { user } = useUser();

            const _user = await ctx.db.user.findUnique({
                where: {
                    externalId: user?.id
                }
            });

            if (!user)
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication failed for this request.' });

            const userTypes = await ctx.db.userType.findMany();

            let isStaff = false;

            // Can add in staff types here to allow access to our staff
            if (userTypes.find((userType) => userType.name === 'Admin')?.id === _user?.userTypeId)
                isStaff = true;

            if (document.userId !== input.userId && !isStaff)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Only the account that uploaded this document may retrieve it.' });

            return document;
        }
    ),
    list: protectedProcedure
        .input(
            z.object({
                userId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const documents = await ctx.db.document.findMany({
                where: {
                    userId: input.userId
                }
            });

            return documents;
        })
});