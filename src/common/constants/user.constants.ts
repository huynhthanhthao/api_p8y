import { Prisma } from '@prisma/client'

export const USER_INCLUDE_FIELDS = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    type: true,
    status: true,
    address: true,
    lastLogin: true,
    avatarUrl: true
  }
} as const satisfies Partial<Prisma.UserFindUniqueArgs>
