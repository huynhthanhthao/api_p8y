import { select } from './../../types/paymentMethod.type'
import { StockCardTypeEnum } from '@common/enums'
import { PRODUCT_ERROR, PRODUCT_LOT_ERROR, STOCK_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus } from '@nestjs/common'

interface BaseStockInput {
  isLotEnabled: boolean
  productId: string
  quantity: number
}

interface StockInputWithLot extends BaseStockInput {
  isLotEnabled: true
  productLotId: string
}

interface StockInputWithoutLot extends BaseStockInput {
  isLotEnabled: false
}

type StockInput = StockInputWithLot | StockInputWithoutLot

export async function updateStockQuantity(
  data: StockInput,
  type: StockCardTypeEnum,
  tx: PrismaService
) {
  let updatedStockQuantity: number

  if (data.isLotEnabled) {
    /**
     * Có sử dụng lô, cập nhật số lượng cho từng productLot
     */
    const productLot = await tx.productLot.findUnique({
      where: { id: data.productLotId, productId: data.productId },
      select: { stockQuantity: true, product: { select: { code: true } } }
    })

    if (!productLot) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_LOT_ERROR.PRODUCT_LOT_NOT_FOUND)
    }

    switch (type) {
      case StockCardTypeEnum.STOCK_TRANSACTION_CHECK:
        updatedStockQuantity = data.quantity
        break
      case StockCardTypeEnum.STOCK_TRANSACTION_IMPORT:
        updatedStockQuantity = productLot.stockQuantity + data.quantity
        break
      case StockCardTypeEnum.STOCK_TRANSACTION_CANCEL:
      case StockCardTypeEnum.INVOICE:
        updatedStockQuantity = productLot.stockQuantity - data.quantity
        break
      default:
        throw new HttpException(HttpStatus.NOT_FOUND, STOCK_ERROR.INVALID_STOCK_UPDATE_TYPE)
    }

    if (updatedStockQuantity < 0) {
      throw new HttpException(HttpStatus.NOT_FOUND, STOCK_ERROR.INSUFFICIENT_STOCK_LOT, [
        productLot.product.code
      ])
    }

    await tx.productLot.update({
      where: { id: data.productLotId },
      data: { stockQuantity: updatedStockQuantity }
    })
  } else {
    /**
     * Không sử dụng lô, cập nhật số lượng tổng trên product
     */
    const product = await tx.product.findUnique({
      where: { id: data.productId },
      select: { stockQuantity: true }
    })

    if (!product) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    let updatedStockQuantity: number

    switch (type) {
      case StockCardTypeEnum.STOCK_TRANSACTION_IMPORT:
        updatedStockQuantity = (product.stockQuantity ?? 0) + data.quantity
        break
      case StockCardTypeEnum.STOCK_TRANSACTION_CHECK:
        updatedStockQuantity = data.quantity
        break
      case StockCardTypeEnum.STOCK_TRANSACTION_CANCEL:
      case StockCardTypeEnum.INVOICE:
        updatedStockQuantity = (product.stockQuantity ?? 0) - data.quantity
        break
      default:
        throw new HttpException(HttpStatus.NOT_FOUND, STOCK_ERROR.INVALID_STOCK_UPDATE_TYPE)
    }

    if (updatedStockQuantity < 0) {
      throw new HttpException(HttpStatus.NOT_FOUND, STOCK_ERROR.INSUFFICIENT_STOCK_PRODUCT)
    }

    await tx.product.update({
      where: { id: data.productId },
      data: { stockQuantity: updatedStockQuantity }
    })
  }
}
