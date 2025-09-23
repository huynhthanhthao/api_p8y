import { Prisma } from '@prisma/client'

export const USER_BASIC_INFO_SELECT = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    type: true,
    status: true,
    address: true,
    lastLogin: true
  }
} as const satisfies Partial<Prisma.UserFindUniqueArgs>

export const USER_SELECT_FIELDS = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    type: true,
    status: true,
    address: true,
    gender: true,
    lastLogin: true,
    avatar: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    },
    province: true,
    ward: true,
    provinceCode: true,
    wardCode: true,
    roles: {
      select: {
        id: true,
        name: true
      }
    },
    branches: {
      select: {
        id: true,
        name: true
      }
    }
  }
} as const satisfies Partial<Prisma.UserFindUniqueArgs>
