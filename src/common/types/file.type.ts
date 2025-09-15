import { Prisma } from '@prisma/client'

export const FileRelations = Prisma.validator<Prisma.FileFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  }
})

export type File = Prisma.FileGetPayload<typeof FileRelations>
