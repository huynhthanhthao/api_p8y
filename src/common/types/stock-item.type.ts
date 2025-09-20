import { Prisma } from '@prisma/client'

export const stockItemSelect = Prisma.validator<Prisma.StockItemFindFirstArgs>()({})

export type StockItem = Prisma.StockItemGetPayload<typeof stockItemSelect>
