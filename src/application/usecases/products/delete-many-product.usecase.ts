import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { PRODUCT_ERROR } from '@common/errors'
import { generateTimesTamp } from '@common/helpers'

@Injectable()
export class DeleteManyProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const products = await this.prismaClient.product.findMany({
      where: {
        id: { in: data.ids },
        branchId
      },
      select: {
        id: true,
        code: true,
        barcode: true
      }
    })

    if (products.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.SOME_PRODUCTS_NOT_FOUND)
    }

    const updatePromises = products.map(product =>
      this.prismaClient.product.update({
        where: { id: product.id, branchId },
        data: {
          deletedBy: userId,
          code: `del_${product.code}_${generateTimesTamp()}`,
          barcode: `del_${product.barcode}_${generateTimesTamp()}`
        }
      })
    )

    await Promise.all(updatePromises)

    return await this.prismaClient.product.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
