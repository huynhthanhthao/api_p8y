import { Prisma } from '@prisma/client'

export const productUnitSelect = Prisma.validator<Prisma.ProductUnitFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type ProductUnit = Prisma.ProductUnitGetPayload<typeof productUnitSelect>
