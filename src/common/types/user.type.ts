import { USER_SELECT_FIELDS } from '@common/constants'
import { Prisma } from '@prisma/client'

export type UserBasicInfo = Prisma.UserGetPayload<{
  select: {
    id: true
    firstName: true
    lastName: true
    phone: true
    email: true
    type: true
    status: true
    address: true
    lastLogin: true
    avatarId: true
    avatar: {
      omit: {
        deletedAt: true
        deletedBy: true
        createdBy: true
        updatedBy: true
      }
    }
  }
}>

export const userSelect = Prisma.validator<Prisma.UserFindFirstArgs>()({
  ...USER_SELECT_FIELDS
})

export type User = Prisma.UserGetPayload<typeof userSelect>
