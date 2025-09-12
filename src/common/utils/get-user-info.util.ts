import { PrismaClient } from '@prisma/client/extension'
import { UserBasicInfo } from '../types'

export async function getUserInfo(tx: PrismaClient, userId: string): Promise<UserBasicInfo> {
  return tx.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      type: true,
      phone: true,
      avatarUrl: true,
      status: true
    }
  })
}
