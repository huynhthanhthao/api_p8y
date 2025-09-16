import { Prisma } from '@prisma/client'

export const medicineRouteSelect = Prisma.validator<Prisma.MedicineRouteFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type MedicineRoute = Prisma.MedicineRouteGetPayload<typeof medicineRouteSelect>
