import { Prisma } from '@prisma/client'

export type Branch = Prisma.BranchGetPayload<{
  omit: {
    deletedAt: true
    deletedBy: true
    createdBy: true
    createdAt: true
    updatedAt: true
    updatedBy: true
  }
}>
