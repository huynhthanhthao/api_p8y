import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { ReportRevenueItemDto, ReportRevenueResponseDto } from '@interface-adapter/dtos/reports'
import { ReportQueryDto } from '@common/dtos'
import { DiscountTypeEnum, InvoiceStatusEnum, ReportGroupByEnum } from '@common/enums'

@Injectable()
export class ReportRevenueUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(params: ReportQueryDto, branchId: string): Promise<ReportRevenueResponseDto> {
    const { from, to, groupBy } = params

    const invoices = await this.prismaService.invoice.findMany({
      where: {
        status: InvoiceStatusEnum.PAID,
        deletedAt: null,
        branchId,
        ...(from && to
          ? {
              createdAt: {
                gte: new Date(from),
                lte: new Date(to)
              }
            }
          : {})
      },
      select: {
        id: true,
        invoiceItems: {
          select: {
            id: true,
            quantity: true,
            salePrice: true,
            discountType: true,
            discountValue: true
          }
        },
        discountType: true,
        discountValue: true,
        paymentMethodCode: true,
        createdAt: true
      }
    })

    /**
     * Tính toán revenue cho từng invoice
     */
    const invoiceRevenues = invoices.map(invoice => {
      /**
       * Tính tổng revenue từ các invoice items
       */
      const itemsRevenue = invoice.invoiceItems.reduce((total, item) => {
        const itemTotal = item.quantity * item.salePrice
        let itemDiscount = 0

        if (item.discountType === DiscountTypeEnum.PERCENT) {
          itemDiscount = itemTotal * ((item.discountValue || 0) / 100)
        } else if (item.discountType === DiscountTypeEnum.VALUE) {
          itemDiscount = item.discountValue || 0
        }

        return total + (itemTotal - itemDiscount)
      }, 0)

      /**
       * Áp dụng discount của invoice
       */
      let invoiceDiscount = 0
      if (invoice.discountType === DiscountTypeEnum.PERCENT) {
        invoiceDiscount = itemsRevenue * ((invoice.discountValue || 0) / 100)
      } else if (invoice.discountType === DiscountTypeEnum.VALUE) {
        invoiceDiscount = invoice.discountValue || 0
      }

      const finalRevenue = itemsRevenue - invoiceDiscount

      return {
        revenue: finalRevenue,
        period: this.getPeriodFromDate(invoice.createdAt, groupBy),
        createdAt: invoice.createdAt
      }
    })

    // Group revenue theo period
    const groupedRevenue = invoiceRevenues.reduce(
      (acc, curr) => {
        if (!acc[curr.period]) {
          acc[curr.period] = 0
        }
        acc[curr.period] += curr.revenue
        return acc
      },
      {} as Record<string, number>
    )

    /**
     * Chuyển đổi thành mảng items
     */
    const items: ReportRevenueItemDto[] = Object.entries(groupedRevenue)
      .map(([period, revenue]) => ({
        period,
        revenue: Math.round(revenue)
      }))
      .sort((a, b) => a.period.localeCompare(b.period))

    /**
     * Tính tổng revenue
     */
    const totalRevenue = items.reduce((total, item) => total + item.revenue, 0)

    return {
      items,
      totalRevenue,
      totalInvoices: invoices.length
    }
  }

  private getPeriodFromDate(date: Date, groupBy: ReportGroupByEnum): string {
    const d = new Date(date)

    switch (groupBy) {
      case ReportGroupByEnum.HOUR:
        return `${d.toISOString().split('T')[0]} ${d.getHours().toString().padStart(2, '0')}:00`
      case ReportGroupByEnum.DAY:
        return d.toISOString().split('T')[0]
      case ReportGroupByEnum.MONTH:
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
      case ReportGroupByEnum.YEAR:
        return d.getFullYear().toString()
      default:
        return d.toISOString().split('T')[0]
    }
  }
}
