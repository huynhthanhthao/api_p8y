import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { Product } from '@common/types'
import { CreateStockTransactionRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { HttpStatus } from '@nestjs/common'

/**
 * Check sản phẩm có bật quản lý kho không
 */
export function checkInventoryEnabled(
  data: CreateStockTransactionRequestDto,
  productList: Pick<Product, 'id' | 'isStockEnabled' | 'code'>[]
): void {
  for (const product of productList) {
    const item = data.stockItems.find(i => i.productId === product.id)

    if (!item) continue

    if (!product.isStockEnabled) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        STOCK_TRANSACTION_ERROR.PRODUCT_NOT_INVENTORY_ENABLED,
        [product.code]
      )
    }
  }
}
