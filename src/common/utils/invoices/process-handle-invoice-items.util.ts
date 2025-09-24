import { PrismaService } from '@infrastructure/prisma'
import { StockCardTypeEnum } from '@common/enums'
import { PRODUCT_ERROR } from '@common/errors'
import { Product } from '@common/types'
import { HttpStatus } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateInvoiceItemRequestDto } from '@interface-adapter/dtos/invoinces'
import { updateStockQuantity } from '../update-stock-quantity.util'
import { calculateTargetProductAndRate } from '../calculate-target-product-and-rate.util'

/**
 * Kết quả group sau khi tính toán
 */
export interface ProcessedInvoiceItem {
  productParentId: string // luôn là ID của parent
  finalQuantity: number
  productLotId?: string
  isLotEnabled: boolean
  isStockEnabled: boolean
}

/**
 * Xử lý invoice items với logic group theo parent và conversion rate
 */
export async function processHandleInvoiceItems(
  invoiceItems: CreateInvoiceItemRequestDto[],
  productList: Pick<
    Product,
    'id' | 'isStockEnabled' | 'isLotEnabled' | 'code' | 'parent' | 'conversion'
  >[],
  stockCardType: StockCardTypeEnum,
  tx: PrismaService
): Promise<void> {
  const productMap = new Map(productList.map(p => [p.id, p]))

  /**
   * Group invoice items theo parent và tính toán conversion
   */
  const parentGroupedItems = groupInvoiceItemsByParent(invoiceItems, productMap)

  /**
   * Xử lý cập nhật kho cho các items đã group
   */
  const updatePromises = Array.from(parentGroupedItems.values()).map(async item => {
    // Chỉ cập nhật kho nếu sản phẩm parent bật quản lý kho
    if (!item.isStockEnabled) return

    const stockInput = item.isLotEnabled
      ? {
          productId: item.productParentId,
          isLotEnabled: true as const,
          quantity: item.finalQuantity,
          productLotId: item.productLotId!
        }
      : {
          productId: item.productParentId,
          isLotEnabled: false as const,
          quantity: item.finalQuantity
        }

    return updateStockQuantity(stockInput, stockCardType, tx)
  })

  await Promise.all(updatePromises)
}

/**
 * Group invoice items theo parent và áp dụng conversion rate
 */
function groupInvoiceItemsByParent(
  invoiceItems: CreateInvoiceItemRequestDto[],
  productMap: Map<
    string,
    Pick<Product, 'id' | 'isStockEnabled' | 'isLotEnabled' | 'code' | 'parent' | 'conversion'>
  >
): Map<string, ProcessedInvoiceItem> {
  const result = new Map<string, ProcessedInvoiceItem>()

  for (const item of invoiceItems) {
    const product = productMap.get(item.productId)

    if (!product) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    /**
     * Xác định target product (luôn là parent) và conversion rate
     */
    const { targetProductId, conversionRate } = calculateTargetProductAndRate(product)

    const parentProduct = productMap.get(targetProductId)

    if (!parentProduct) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    /**
     * Tính quantity sau conversion
     */
    const convertedQuantity = item.quantity * conversionRate

    /**
     * Tạo key để group (parentId + productLotId)
     */
    const groupKey = `${targetProductId}-${item.productLotId ?? 'no-lot'}`

    const existing = result.get(groupKey)

    if (existing) {
      existing.finalQuantity += convertedQuantity
    } else {
      result.set(groupKey, {
        finalQuantity: convertedQuantity,
        productParentId: targetProductId,
        isLotEnabled: parentProduct.isLotEnabled,
        isStockEnabled: parentProduct.isStockEnabled,
        productLotId: item.productLotId
      })
    }
  }

  return result
}
