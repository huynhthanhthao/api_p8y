import { PRODUCT_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { HttpStatus } from '@nestjs/common'

export function validateValidEnableLot(
  isLotEnabled: boolean,
  isStockEnabled: boolean,
  stockQuantity?: number
): void {
  if (typeof isLotEnabled !== 'boolean') return

  if (!isStockEnabled && isLotEnabled) {
    throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_ERROR.LOT_REQUIRES_ENABLE_STOCK)
  }

  if (isLotEnabled && typeof stockQuantity === 'number') {
    throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_ERROR.STOCK_QUANTITY_NOT_ALLOWED)
  }

  if (isStockEnabled && !isLotEnabled && typeof stockQuantity !== 'number') {
    throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_ERROR.STOCK_QUANTITY_REQUIRED)
  }
}
