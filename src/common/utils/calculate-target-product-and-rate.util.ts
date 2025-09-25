import { Product } from '@common/types'

export function calculateTargetProductAndRate(
  product: Pick<Product, 'id' | 'parent' | 'conversion'>
): {
  targetProductId: string
  conversionRate: number
} {
  if (product.parent) {
    // Là variant: tính về parent
    return {
      targetProductId: product.parent.id, // ID của parent
      conversionRate: (product.parent.conversion || 1) * (product.conversion || 1)
    }
  } else {
    // Là parent: giữ nguyên
    return {
      targetProductId: product.id, // Vẫn là chính nó (parent)
      conversionRate: product.conversion || 1
    }
  }
}
