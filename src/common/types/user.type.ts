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
    avatarUrl: true
  }
}>
