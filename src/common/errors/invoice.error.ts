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
  SOME_INVOICES_CANCELED: {
    code: 'INVOICE_04',
    message: 'Một số sản phẩm đã hủy hoặc không cho phép bán'
  },
  INVOICE_CANCELED: {
    code: 'INVOICE_05',
    message: 'Hóa đơn đã hủy'
  },
  CANNOT_CREATE_CANCELED_INVOICE: {
    code: 'INVOICE_06',
    message: 'Không thể tạo hóa đơn với trạng thái hủy'
  },
  UNEXPECTED_PRODUCT_LOT: {
    code: 'INVOICE_07',
    message: 'Không thể khai báo lô cho sản phẩm không quản lý theo lô'
  }
}
