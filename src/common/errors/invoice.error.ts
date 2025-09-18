export const INVOICE_ERROR = {
  INVOICE_NOT_FOUND: {
    code: 'INVOICE_01',
    message: 'Hóa đơn không tồn tại'
  },
  SOME_INVOICES_NOT_FOUND: {
    code: 'INVOICE_02',
    message: 'Một số sản phẩm không tồn tại hoặc không cho phép bán'
  },
  MISSING_PRODUCT_LOT_ID: {
    code: 'INVOICE_03',
    message: 'Sản phẩm yêu cầu lô nhưng không được cung cấp'
  },
  INVALID_QUANTITY_FOR_LOT: {
    code: 'INVOICE_04',
    message: 'Sản phẩm quản lý theo lô không được phép có số lượng khác 0'
  },
  UNEXPECTED_PRODUCT_LOT: {
    code: 'INVOICE_05',
    message: 'Không thể khai báo lô cho sản phẩm không quản lý theo lô'
  }
}
