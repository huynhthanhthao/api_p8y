import { STOCK_TRANSACTION_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { Product } from '@common/types'
import { HttpStatus } from '@nestjs/common'

/**
 * Check sản phẩm có bật quản lý kho không
 */
export function checkInventoryEnabled(
  productList: Pick<Product, 'id' | 'isStockEnabled' | 'code' | 'parent'>[]
): void {
  for (const product of productList) {
    /**
     * Sản phẩm bật kho hoặc sp parent bật kho
     */
    if (product.isStockEnabled || product.parent?.isStockEnabled) continue
    else {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        STOCK_TRANSACTION_ERROR.PRODUCT_NOT_INVENTORY_ENABLED,
        product.code
      )
    }
  }
}
