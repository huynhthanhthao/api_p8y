import { PrismaClient } from '@prisma/client/extension'
import { UserBasicInfo } from '../../types'
import { File_SELECT_FIELDS } from '@common/constants/file.constants'

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
      status: true,
      avatarId: true,
      avatar: File_SELECT_FIELDS
    }
  })
}
