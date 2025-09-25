export class ReportTopCustomerByOrderItemDto {
  customerId: string
  customerName: string
  customerCode: string
  customerPhone: string
  totalInvoices: number
  totalAmount: number
}

export class ReportTopCustomerByOrderResponseDto {
  items: ReportTopCustomerByOrderItemDto[]
}
