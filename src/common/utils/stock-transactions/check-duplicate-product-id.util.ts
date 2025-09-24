import { StockTransactionTypeEnum } from '@common/enums'
import { PRODUCT_ERROR, STOCK_TRANSACTION_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { Product } from '@common/types'
import { StockItemRequestDto } from '@interface-adapter/dtos/stock-transactions'
import { HttpStatus } from '@nestjs/common'

/**
 * Check sản phẩm có trùng trong phiếu kiểm không
 */
export function checkDuplicateProductId(
  type: StockTransactionTypeEnum,
  stockItems: StockItemRequestDto[],
  productList: Pick<Product, 'id' | 'isLotEnabled' | 'code'>[]
): void {
  if (type !== StockTransactionTypeEnum.CHECK) {
    return
  }

  const seen = new Set<string>()

  for (const item of stockItems) {
    const product = productList.find(p => p.id === item.productId)

    if (!product) {
      throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    const key = product.isLotEnabled
      ? `${item.productId}-${item.productLotId ?? 'no-lot'}`
      : item.productId

    if (seen.has(key)) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        STOCK_TRANSACTION_ERROR.DUPLICATE_PRODUCT_IN_CHECK,
        product.code
      )
    }

    seen.add(key)
  }
}
