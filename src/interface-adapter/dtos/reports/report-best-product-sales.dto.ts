export class ReportBestProductItemDto {
  productId: string
  productName: string
  totalQuantity: number
}

export class ReportBestProductResponseDto {
  items: ReportBestProductItemDto[]
}
