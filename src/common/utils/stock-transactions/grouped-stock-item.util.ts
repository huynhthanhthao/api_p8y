import { StockItemRequestDto } from '@interface-adapter/dtos/stock-transactions'

export function groupStockItems(stockItems: StockItemRequestDto[]): StockItemRequestDto[] {
  const map = new Map<string, StockItemRequestDto>()

  for (const item of stockItems) {
    const key = `${item.productId}-${item.productLotId ?? 'no-lot'}`
    if (map.has(key)) {
      const existing = map.get(key)!
      existing.quantity += item.quantity
    } else {
      map.set(key, { ...item })
    }
  }

  return Array.from(map.values())
}
