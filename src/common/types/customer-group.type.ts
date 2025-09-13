import { Prisma } from '@prisma/client'

export type CustomerGroup = Prisma.CustomerGroupGetPayload<{
  select: {
    id: true
    name: true
    discountValue: true
    discountType: true
    createdAt: true
  }
}>
