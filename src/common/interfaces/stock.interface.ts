import { Product } from '@common/types'
import { StockTransactionTypeEnum } from '@common/enums'
import { PrismaService } from '@infrastructure/prisma'

export interface IGroupedProduct {
  productId: string
  quantity: number
  lots?: { lotId: string; quantity: number }[]
  product: Product
}

export interface IStockContext {
  transId: string
  type: StockTransactionTypeEnum
  isCompleted: boolean
  prisma: PrismaService
}
