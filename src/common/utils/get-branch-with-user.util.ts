import { PrismaService } from 'src/infrastructure/prisma'
import { Branch } from '../types/branch.type'

export async function getBranchWithUser(
  prisma: PrismaService,
  branchId: string,
  userId: string
): Promise<Branch | null> {
  return prisma.branch.findUnique({
    where: {
      id: branchId,
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
  })
}
