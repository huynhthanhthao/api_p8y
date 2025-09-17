import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { Prisma } from '@prisma/client'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_ERROR } from '@common/errors'

@Injectable()
export class DeleteManySupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const suppliers = await this.prismaClient.supplier.findMany({
      where: {
        id: { in: data.ids },
        branchId
      },
      select: {
        id: true,
        code: true,
        phone: true
      }
    })

    if (suppliers.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_ERROR.SOME_SUPPLIERS_NOT_FOUND)
    }

    await this.prismaClient.supplier.updateMany({
      where: {
        id: { in: data.ids },
        branchId
      },
      data: {
        deletedBy: userId
      }
    })

    return await this.prismaClient.supplier.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
