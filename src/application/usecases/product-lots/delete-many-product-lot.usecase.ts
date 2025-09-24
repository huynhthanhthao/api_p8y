import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { PRODUCT_LOT_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const existingGroups = await this.prismaClient.productLot.findMany({
      where: {
        id: { in: data.ids },
        branchId
      },
      select: {
        id: true
      }
    })

    if (existingGroups.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_LOT_ERROR.SOME_PRODUCT_LOTS_NOT_FOUND)
    }

    return await this.prismaClient.productLot.updateMany({
      where: { id: { in: data.ids }, branchId },
      data: { deletedBy: userId, deletedAt: new Date() }
    })
  }
}
