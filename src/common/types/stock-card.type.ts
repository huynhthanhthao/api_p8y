import { Prisma } from '@prisma/client'

export const stockCardSelect = Prisma.validator<Prisma.StockCardFindFirstArgs>()({})

export type StockCard = Prisma.StockCardGetPayload<typeof stockCardSelect>
