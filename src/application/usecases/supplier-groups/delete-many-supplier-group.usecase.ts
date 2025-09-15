import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_GROUP_ERROR } from '@common/errors/supplier-group.error'

@Injectable()
export class DeleteManySupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const suppliers = await this.prismaClient.supplierGroup.findMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })

    if (suppliers.length !== data.ids.length) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        SUPPLIER_GROUP_ERROR.SOME_SUPPLIER_GROUPS_NOT_FOUND
      )
    }

    await this.prismaClient.supplierGroup.updateMany({
      where: {
        id: { in: data.ids },
        branchId
      },
      data: {
        deletedBy: userId
      }
    })

    return await this.prismaClient.supplierGroup.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
