import { Prisma } from '@prisma/client'

export type Province = Prisma.ProvinceGetPayload<{
  select: {
    code: true
    name: true
    divisionType: true
    codeName: true
    phoneCode: true
  }
}>
