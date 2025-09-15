import { Prisma } from '@prisma/client'

export const ProvinceRelations = Prisma.validator<Prisma.ProvinceFindFirstArgs>()({})

export type Province = Prisma.ProvinceGetPayload<typeof ProvinceRelations>
