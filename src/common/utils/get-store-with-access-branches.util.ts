import { PrismaService } from '@infrastructure/prisma'
import { StoreWithBranches } from '../types'

export async function getStoreWithAccessibleBranches(
  prisma: PrismaService,
  storeCode: string,
  userId?: string
): Promise<StoreWithBranches> {
  return prisma.store.findUniqueOrThrow({
    where: {
      code: storeCode
    },
    include: {
      branches: {
        where: {
          ...(userId && {
            users: {
              some: {
                id: userId
              }
            }
          })
        },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
          updatedBy: true
        }
      }
    }
  })
}
