import { Prisma } from '@prisma/client'

export const FILE_SELECT_FIELDS = {
  select: {
    id: true,
    filename: true,
    originalName: true,
    path: true
  }
} as const satisfies Partial<Prisma.FileFindUniqueArgs>
