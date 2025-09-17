import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllInvoiceRequestDto,
  GetAllInvoiceResponseDto
} from '@interface-adapter/dtos/invoinces'
import { INVOICE_INCLUDE_FIELDS } from '@common/constants'

@Injectable()
export class GetAllInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    data: GetAllInvoiceRequestDto,
    branchId: string
  ): Promise<GetAllInvoiceResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, from, to } = data

    const where: Prisma.InvoiceWhereInput = {
      branchId,
      deletedAt: null,
      ...(from && to
        ? {
            createdAt: {
              gte: new Date(from),
              lte: new Date(to)
            }
          }
        : {}),
      ...(from && !to
        ? {
            createdAt: {
              gte: new Date(from)
            }
          }
        : {}),
      ...(!from && to
        ? {
            createdAt: {
              lte: new Date(to)
            }
          }
        : {})
    }

    if (keyword) {
      where.OR = []
    }

    return await this.prismaService.findManyWithPagination(
      'invoice',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        ...INVOICE_INCLUDE_FIELDS
      },
      { page, perPage }
    )
  }
}
