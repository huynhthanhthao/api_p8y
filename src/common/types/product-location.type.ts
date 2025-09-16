import { Prisma } from '@prisma/client'

export const productLocationSelect = Prisma.validator<Prisma.ProductLocationFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type ProductLocation = Prisma.ProductLocationGetPayload<typeof productLocationSelect>
