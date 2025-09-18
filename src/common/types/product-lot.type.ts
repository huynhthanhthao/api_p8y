import { Prisma } from '@prisma/client'

export const ProductLotRelations = Prisma.validator<Prisma.ProductLotFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  }
})

export type ProductLot = Prisma.ProductLotGetPayload<typeof ProductLotRelations>
