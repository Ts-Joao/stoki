import { Prisma } from '@prisma/client';

const modelsWithSoftDelete = ['Product'] as const;

export function softDeleteExtension() {
  return Prisma.defineExtension((client) => {
    return client.$extends({
      query: {
        product: {
          async findMany({ args, query }) {
            args.where = {
              ...args.where,
              OR: [
                { deletedAt: null },
                { deletedAt: { gt: new Date() } },
              ],
            };
            return query(args);
          },
          async findFirst({ args, query }) {
            args.where = {
              ...args.where,
              OR: [
                { deletedAt: null },
                { deletedAt: { gt: new Date() } },
              ],
            };
            return query(args);
          },
          async findUnique({ args, query }) {
            return query(args);
          },
        },
      },
    });
  });
}