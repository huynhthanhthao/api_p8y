import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { PRODUCT_LOT_ERROR } from '@common/errors'

@Injectable()
export class DeleteProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const productLot = await this.prismaClient.productLot.findUnique({
      where: { id, branchId }
    })

    if (!productLot) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_LOT_ERROR.PRODUCT_LOT_NOT_FOUND)
    }

    await this.prismaClient.productLot.update({
      where: { id, branchId },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.productLot.delete({
      where: {
        id,
        branchId
      }
    })

    return id
  }
}
