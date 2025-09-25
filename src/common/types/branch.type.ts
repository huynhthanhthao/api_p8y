import { Prisma } from '@prisma/client'

export const branchSelect = Prisma.validator<Prisma.BranchFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true
  }
})

export type Branch = Prisma.BranchGetPayload<typeof branchSelect>
