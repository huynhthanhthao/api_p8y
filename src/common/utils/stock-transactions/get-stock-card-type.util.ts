import { StockCardTypeEnum, StockTransactionTypeEnum } from '@common/enums'

export const getStockCardType = (type: StockTransactionTypeEnum): StockCardTypeEnum => {
  if (type === StockTransactionTypeEnum.CANCEL) {
    return StockCardTypeEnum.STOCK_TRANSACTION_CANCEL
  }
  if (type === StockTransactionTypeEnum.CHECK) {
    return StockCardTypeEnum.STOCK_TRANSACTION_CHECK
  }
  if (type === StockTransactionTypeEnum.IMPORT) {
    return StockCardTypeEnum.STOCK_TRANSACTION_IMPORT
  }

  return StockCardTypeEnum.INVOICE
}
