import { Prisma } from '@prisma/client'

export const productSelect = Prisma.validator<Prisma.ProductFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type Product = Prisma.ProductGetPayload<typeof productSelect>
