import { Prisma } from '@prisma/client'

export type StoreWithBranches = Prisma.StoreGetPayload<{
  include: {
    branches: {
      omit: {
        deletedAt: true
        deletedBy: true
        createdBy: true
        createdAt: true
        updatedAt: true
        updatedBy: true
      }
    }
  }
}>
