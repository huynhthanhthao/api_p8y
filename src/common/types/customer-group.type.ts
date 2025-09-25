import { Prisma } from '@prisma/client'

export const customerGroupSelect = Prisma.validator<Prisma.CustomerGroupFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type CustomerGroup = Prisma.CustomerGroupGetPayload<typeof customerGroupSelect>
