import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { ReportTopCustomerByOrderResponseDto } from '@interface-adapter/dtos/reports'
import { ReportQueryDto } from '@common/dtos'
import { InvoiceStatusEnum, DiscountTypeEnum } from '@common/enums'

@Injectable()
export class ReportTopCustomerByOrderUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    params: ReportQueryDto,
    branchId: string
  ): Promise<ReportTopCustomerByOrderResponseDto> {
    const { from, to } = params

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
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            code: true
          }
        },
        invoiceItems: {
          select: {
            quantity: true,
            salePrice: true,
            discountType: true,
            discountValue: true
          }
        },
        discountType: true,
        discountValue: true
      }
    })

    /**
     * Tính toán tổng số lượng invoice và tổng tiền cho từng khách hàng
     */
    const customerSalesMap = invoices.reduce(
      (acc, invoice) => {
        if (!invoice.customer) return acc

        const customerId = invoice.customer.id

        if (!acc[customerId]) {
          acc[customerId] = {
            customerId: customerId,
            customerName: invoice.customer.name,
            customerPhone: invoice.customer.phone || '', // Xử lý phone null
            customerCode: invoice.customer.code || '', // Xử lý code null
            totalInvoices: 0,
            totalAmount: 0
          }
        }

        // Tính tổng tiền cho invoice này
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

        // Áp dụng discount của invoice
        let invoiceDiscount = 0
        if (invoice.discountType === DiscountTypeEnum.PERCENT) {
          invoiceDiscount = itemsRevenue * ((invoice.discountValue || 0) / 100)
        } else if (invoice.discountType === DiscountTypeEnum.VALUE) {
          invoiceDiscount = invoice.discountValue || 0
        }

        const finalAmount = itemsRevenue - invoiceDiscount

        // Cập nhật thống kê
        acc[customerId].totalInvoices += 1
        acc[customerId].totalAmount += finalAmount

        return acc
      },
      {} as Record<
        string,
        {
          customerId: string
          customerName: string
          customerPhone: string
          customerCode: string
          totalInvoices: number
          totalAmount: number
        }
      >
    )

    /**
     * Chuyển đổi thành mảng, sắp xếp theo tổng tiền giảm dần và lấy top 5
     */
    const items = Object.values(customerSalesMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map(item => ({
        customerId: item.customerId,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        customerCode: item.customerCode,
        totalInvoices: item.totalInvoices,
        totalAmount: Math.round(item.totalAmount)
      }))

    return {
      items
    }
  }
}
