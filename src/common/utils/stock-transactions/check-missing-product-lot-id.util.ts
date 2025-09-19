import { PRODUCT_ERROR, PRODUCT_LOT_ERROR, STOCK_TRANSACTION_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { Product } from '@common/types'
import { CreateStockTransactionRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { HttpStatus } from '@nestjs/common'

export function checkMissingProductLotId(
  data: CreateStockTransactionRequestDto,
  productList: Pick<Product, 'id' | 'isLotEnabled' | 'code' | 'productLots'>[]
): void {
  for (const item of data.stockItems) {
    const product = productList.find(p => p.id === item.productId)

    if (!product) {
      throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_ERROR.PRODUCT_NOT_FOUND, [
        item.productId
      ])
    }

    if (product.isLotEnabled) {
      /**
       * Quản lý theo lô: bắt buộc có productLotId
       */
      if (!item.productLotId) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          STOCK_TRANSACTION_ERROR.MISSING_PRODUCT_LOT_ID,
          [product.code]
        )
      }

      /**
       * Kiểm tra lô đúng của sản phẩm không
       */
      const productLot = product.productLots.find(p => p.id === item.productLotId)

      if (!productLot) {
        throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_LOT_ERROR.PRODUCT_LOT_NOT_FOUND, [
          product.code
        ])
      }
    } else {
      /**
       * Không quản lý lô: không được truyền productLotId
       */
      if (item.productLotId) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          STOCK_TRANSACTION_ERROR.UNEXPECTED_PRODUCT_LOT,
          [product.code]
        )
      }
    }
  }
}
