import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Invoice } from '@common/types'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'
import { INVOICE_INCLUDE_FIELDS } from '@common/constants'

@Injectable()
export class GetOneInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string, branchId: string): Promise<Invoice> {
    const invoice = await this.prismaService.invoice.findUnique({
      where: {
        id,
        branchId,
        deletedAt: null
      },
      ...INVOICE_INCLUDE_FIELDS
    })

    if (!invoice) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.INVOICE_NOT_FOUND)
    }

    return invoice
  }
}
