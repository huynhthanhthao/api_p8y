import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'
import { InvoiceStatusEnum } from '@common/enums'

@Injectable()
export class CancelInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const invoice = await this.prismaClient.invoice.findUnique({
      where: { id, branchId }
    })

    if (!invoice) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.INVOICE_NOT_FOUND)
    }

    if (invoice.status === InvoiceStatusEnum.CANCELED) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.INVOICE_CANCELED)
    }

    await this.prismaClient.invoice.update({
      where: { id, branchId },
      data: {
        status: InvoiceStatusEnum.CANCELED,
        updatedBy: userId
      }
    })

    return id
  }
}
