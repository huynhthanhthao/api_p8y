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
  }
}
