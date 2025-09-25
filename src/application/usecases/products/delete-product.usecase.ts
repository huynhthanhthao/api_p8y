import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { PRODUCT_ERROR } from '@common/errors'
import { generateTimesTamp } from '@common/helpers'

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const product = await this.prismaClient.product.findUnique({
      where: { id, branchId },
      include: {
        variants: {
          select: {
            id: true,
            code: true,
            barcode: true
          }
        }
      }
    })

    if (!product) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.SOME_PRODUCTS_NOT_FOUND)
    }

    /**
     *  Soft delete variants trước
     */
    if (product.variants.length > 0) {
      await this.prismaClient.$transaction(
        product.variants.map(variant =>
          this.prismaClient.product.update({
            where: { id: variant.id, branchId },
            data: {
              code: `del_${variant.code}_${generateTimesTamp()}`,
              barcode: variant.barcode ? `del_${variant.barcode}_${generateTimesTamp()}` : null,
              deletedBy: userId
            }
          })
        )
      )

      await this.prismaClient.product.deleteMany({
        where: {
          parentId: id,
          branchId
        }
      })
    }

    /**
     * Soft delete product cha
     */
    await this.prismaClient.product.update({
      where: { id, branchId },
      data: {
        code: `del_${product.code}_${generateTimesTamp()}`,
        barcode: product.barcode ? `del_${product.barcode}_${generateTimesTamp()}` : null,
        deletedBy: userId
      }
    })

    /**
     * Xoá hẳn product cha
     */
    await this.prismaClient.product.delete({
      where: {
        id,
        branchId
      }
    })

    return id
  }
}
