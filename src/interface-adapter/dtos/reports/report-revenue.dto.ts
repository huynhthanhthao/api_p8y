export class ReportRevenueItemDto {
  period: string
  revenue: number
}

export class ReportRevenueResponseDto {
  items: ReportRevenueItemDto[]
  totalRevenue: number
  totalInvoices: number
}
