import { Prisma } from "@prisma/client"

export type StoreWithBranches = Prisma.StoreGetPayload<{
  include: {
    branches: true
  }
}>