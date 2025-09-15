import { Prisma } from '@prisma/client'

export const FileRelations = Prisma.validator<Prisma.FileFindFirstArgs>()({})

export type File = Prisma.FileGetPayload<typeof FileRelations>
