export const STOCK_TRANSACTION_ERROR = {
  STOCK_TRANSACTION_NOT_FOUND: {
    code: 'STOCK_TRANSACTION_01',
    message: 'Phiếu không tồn tại'
  },
  SOME_STOCK_TRANSACTIONS_NOT_FOUND: {
    code: 'STOCK_TRANSACTION_02',
    message: 'Một số phiếu không tồn tại'
  },
  CODE_EXISTS: {
    code: 'STOCK_TRANSACTION_03',
    message: 'Mã phiếu đã tồn tại'
  },
  MISSING_PRODUCT_LOT_ID: {
    code: 'STOCK_TRANSACTION_04',
    message: 'Sản phẩm yêu cầu lô nhưng không được cung cấp'
  },
  UNEXPECTED_PRODUCT_LOT: {
    code: 'STOCK_TRANSACTION_05',
    message: 'Không thể khai báo lô cho sản phẩm không quản lý theo lô'
  },
  STOCK_TRANSACTION_CANCELED: {
    code: 'STOCK_TRANSACTION_06',
    message: 'Phiếu giao dịch đã hủy'
  },
  SOME_STOCK_TRANSACTIONS_CANCELED: {
    code: 'STOCK_TRANSACTION_07',
    message: 'Một số phiếu đã hủy'
  },
  PRODUCT_NOT_INVENTORY_ENABLED: {
    code: 'STOCK_TRANSACTION_08',
    message: 'Có sản phẩm chưa bật quản lý kho'
  },
  STOCK_TRANSACTION_COMPLETED: {
    code: 'STOCK_TRANSACTION_09',
    message: 'Phiếu đã hoàn thành'
  },
  DUPLICATE_PRODUCT_IN_CHECK: {
    code: 'STOCK_TRANSACTION_10',
    message: 'Sản phẩm trùng trong phiếu kiểm'
  }
}
