import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'

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
    const existingGroups = await this.prismaClient.invoice.findMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })

    if (existingGroups.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.SOME_INVOICES_NOT_FOUND)
    }

    await this.prismaClient.invoice.updateMany({
      where: { id: { in: data.ids }, branchId },
      data: { deletedBy: userId }
    })

    return await this.prismaClient.invoice.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
