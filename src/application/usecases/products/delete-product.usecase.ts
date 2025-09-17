import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { PRODUCT_ERROR } from '@common/errors'

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const product = await this.prismaClient.product.findUnique({
      where: { id, branchId }
    })

    if (!product) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.SOME_PRODUCTS_NOT_FOUND)
    }

    await this.prismaClient.product.update({
      where: { id, branchId },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.product.delete({
      where: {
        id,
        branchId
      }
    })

    return id
  }
}
