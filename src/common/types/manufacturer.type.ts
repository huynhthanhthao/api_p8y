import { Prisma } from '@prisma/client'

export const manufacturerSelect = Prisma.validator<Prisma.ManufacturerFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type Manufacturer = Prisma.ManufacturerGetPayload<typeof manufacturerSelect>
