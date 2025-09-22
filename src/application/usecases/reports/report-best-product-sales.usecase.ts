import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import {
  ReportBestProductItemDto,
  ReportBestProductResponseDto
} from '@interface-adapter/dtos/reports'
import { ReportQueryDto } from '@common/dtos'
import { InvoiceStatusEnum } from '@common/enums'

@Injectable()
export class ReportBestProductSalesUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(params: ReportQueryDto, branchId: string): Promise<ReportBestProductResponseDto> {
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
        invoiceItems: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      }
    })

    /**
     * Tính tổng số lượng bán cho từng sản phẩm
     */
    const productSalesMap = invoices.reduce(
      (acc, invoice) => {
        invoice.invoiceItems.forEach(item => {
          const productId = item.product.id

          if (!acc[productId]) {
            acc[productId] = {
              productId: productId,
              productName: item.product.name,
              totalQuantity: 0
            }
          }

          acc[productId].totalQuantity += item.quantity
        })

        return acc
      },
      {} as Record<string, ReportBestProductItemDto>
    )

    /**
     * Chuyển đổi thành mảng, sắp xếp theo số lượng giảm dần và lấy top 5
     */
    const items: ReportBestProductItemDto[] = Object.values(productSalesMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5)

    return {
      items
    }
  }
}
