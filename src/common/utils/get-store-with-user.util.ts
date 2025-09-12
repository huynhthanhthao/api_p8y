import { PrismaService } from 'src/infrastructure/prisma'
import { StoreWithBranches } from '../types'

export async function getStoreWithUserBranches(
  prisma: PrismaService,
  storeCode: string,
  userId: string
): Promise<StoreWithBranches | null> {
  return prisma.store.findUnique({
    where: {
      code: storeCode
    },
    include: {
      branches: {
        where: {
          users: {
            some: {
              id: userId
            }
          }
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
