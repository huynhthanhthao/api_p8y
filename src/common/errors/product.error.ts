export const PRODUCT_ERROR = {
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_01',
    message: 'Sản phẩm không tồn tại'
  },
  SOME_PRODUCTS_NOT_FOUND: {
    code: 'PRODUCT_02',
    message: 'Một số sản phẩm không tồn tại'
  },
  CODE_EXISTS: {
    code: 'PRODUCT_03',
    message: 'Mã sản phẩm đã tồn tại'
  },
  BARCODE_EXISTS: {
    code: 'PRODUCT_04',
    message: 'Mã vạch đã tồn tại'
  },
  MAX_STOCK_NOT_GREATER_THAN_MIN_STOCK: {
    code: 'PRODUCT_05',
    message: 'Tồn tối đa phải lớn hơn tồn tối thiểu'
  },
  STOCK_CARD_EXISTS: {
    code: 'PRODUCT_06',
    message: 'Đã phát sinh giao dịch không thể cập nhập hình thức quản lý kho'
  },
  STOCK_QUANTITY_NOT_ALLOWED: {
    code: 'PRODUCT_09',
    message: 'Sản phẩm quản lý theo lô không được khai báo tồn kho tổng'
  },
  STOCK_QUANTITY_REQUIRED: {
    code: 'PRODUCT_10',
    message: 'Sản phẩm không quản lý theo lô phải khai báo tồn kho tổng'
  },
  LOT_REQUIRES_ENABLE_STOCK: {
    code: 'PRODUCT_11',
    message: 'Sản phẩm quản lý theo lô bắt buộc phải bật quản lý kho'
  },
  UNIT_NAME_ALREADY_EXISTS: {
    code: 'PRODUCT_12',
    message: 'Tên đơn vị bị trùng'
  }
}
