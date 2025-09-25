import { PRODUCT_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { HttpStatus } from '@nestjs/common'

export function validateStockRange(minStock: number | null, maxStock: number | null): void {
  if (minStock != null && maxStock != null && maxStock <= minStock) {
    throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.MAX_STOCK_NOT_GREATER_THAN_MIN_STOCK)
  }
}
