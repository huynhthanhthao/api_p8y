import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'
import { generateTimesTamp } from '@common/helpers'

@Injectable()
export class DeleteManyInvoiceUseCase {
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

    const updatePromises = invoices.map(invoice =>
      this.prismaClient.invoice.update({
        where: { id: invoice.id, branchId },
        data: {
          deletedBy: userId,
          code: `del_${invoice.code}_${generateTimesTamp()}`
        }
      })
    )

    await Promise.all(updatePromises)

    return await this.prismaClient.invoice.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
