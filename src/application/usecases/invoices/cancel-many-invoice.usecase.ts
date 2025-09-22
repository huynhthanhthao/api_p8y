import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'
import { InvoiceStatusEnum } from '@common/enums'

@Injectable()
export class CancelManyInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const invoices = await this.prismaClient.invoice.findMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })

    if (invoices.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.SOME_INVOICES_NOT_FOUND)
    }

    /**
     * Kiểm tra có hóa đơn đã hủy chưa
     */
    const hasInvoiceCanceled = invoices.find(
      invoice => invoice.status === InvoiceStatusEnum.CANCELED
    )

    if (hasInvoiceCanceled) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.SOME_INVOICES_CANCELED)
    }

    return await this.prismaClient.invoice.updateMany({
      where: {
        id: { in: data.ids },
        updatedBy: userId,
        branchId
      },
      data: {
        status: InvoiceStatusEnum.CANCELED
      }
    })
  }
}
