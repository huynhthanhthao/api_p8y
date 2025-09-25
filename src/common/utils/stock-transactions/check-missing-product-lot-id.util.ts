import { PRODUCT_ERROR, PRODUCT_LOT_ERROR, STOCK_TRANSACTION_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { Product } from '@common/types'
import { CreateStockTransactionRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { HttpStatus } from '@nestjs/common'

export function checkMissingProductLotId(
  data: CreateStockTransactionRequestDto,
  productList: Pick<Product, 'id' | 'isLotEnabled' | 'code' | 'productLots' | 'parent'>[]
): void {
  /**
   * Tạo Map để tìm kiếm sản phẩm nhanh hơn
   */
  const productMap = new Map(productList.map(p => [p.id, p]))

  for (const item of data.stockItems) {
    const product = productMap.get(item.productId)

    if (!product) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        PRODUCT_ERROR.PRODUCT_NOT_FOUND,
        item.productId
      )
    }

    const isLotEnabled = product.isLotEnabled || product.parent?.isLotEnabled

    if (isLotEnabled) {
      validateLotEnabledProduct(item, product)
    } else {
      validateLotDisabledProduct(item, product)
    }
  }
}

function validateLotEnabledProduct(
  item: CreateStockTransactionRequestDto['stockItems'][0],
  product: Pick<Product, 'id' | 'isLotEnabled' | 'code' | 'productLots' | 'parent'>
): void {
  /**
   * Quản lý theo lô: bắt buộc có productLotId
   */
  if (!item.productLotId) {
    throw new HttpException(
      HttpStatus.BAD_REQUEST,
      STOCK_TRANSACTION_ERROR.MISSING_PRODUCT_LOT_ID,
      product.code
    )
  }

  /**
   * Kiểm tra lô đúng của sản phẩm
   */
  const productLot = findProductLot(product, item.productLotId)
  if (!productLot) {
    throw new HttpException(
      HttpStatus.BAD_REQUEST,
      PRODUCT_LOT_ERROR.PRODUCT_LOT_NOT_FOUND,
      product.code
    )
  }
}

function validateLotDisabledProduct(
  item: CreateStockTransactionRequestDto['stockItems'][0],
  product: Pick<Product, 'id' | 'isLotEnabled' | 'code' | 'productLots' | 'parent'>
): void {
  /**
   * Không quản lý lô: không được truyền productLotId
   */
  if (item.productLotId) {
    throw new HttpException(
      HttpStatus.BAD_REQUEST,
      STOCK_TRANSACTION_ERROR.UNEXPECTED_PRODUCT_LOT,
      product.code
    )
  }
}

function findProductLot(product: Pick<Product, 'productLots' | 'parent'>, productLotId: string) {
  return (
    product.productLots?.find(p => p.id === productLotId) ||
    product.parent?.productLots?.find(p => p.id === productLotId)
  )
}
