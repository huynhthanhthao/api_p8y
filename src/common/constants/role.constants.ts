import { Prisma } from '@prisma/client'

export const ROLE_SELECT_FIELDS = {
  select: {
    id: true,
    name: true,
    permissions: {
      select: {
        code: true,
        groupCode: true,
        name: true,
        group: {
          select: {
            code: true,
            name: true
          }
        }
      }
    }
  }
} as const satisfies Partial<Prisma.RoleFindUniqueArgs>
