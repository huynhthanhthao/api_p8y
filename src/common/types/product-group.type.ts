import { Prisma } from '@prisma/client'

export const productGroupSelect = Prisma.validator<Prisma.ProductGroupFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    children: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    }
  }
})

export type ProductGroup = Prisma.ProductGroupGetPayload<typeof productGroupSelect>
