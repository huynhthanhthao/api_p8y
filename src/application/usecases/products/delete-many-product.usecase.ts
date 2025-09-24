import { DeleteManyRequestDto } from '@common/dtos'
import { PRODUCT_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { generateTimesTamp } from '@common/helpers'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'

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
    const timestamp = generateTimesTamp()

    return await this.prismaClient.$transaction(async tx => {
      // 1. Kiểm tra sự tồn tại của tất cả products
      const existingProducts = await tx.product.count({
        where: {
          id: { in: data.ids },
          branchId
        }
      })

      if (existingProducts !== data.ids.length) {
        throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.SOME_PRODUCTS_NOT_FOUND)
      }

      // 2. Lấy danh sách tất cả ID cần xóa (bao gồm cả variants)
      const allProductsToDelete = await tx.product.findMany({
        where: {
          OR: [{ id: { in: data.ids } }, { parentId: { in: data.ids } }],
          branchId
        },
        select: {
          id: true,
          code: true,
          barcode: true
        }
      })

      const allIds = allProductsToDelete.map(p => p.id)

      if (allIds.length === 0) {
        return { count: 0 }
      }

      // 3. Soft delete tất cả trong MỘT query duy nhất
      const updateData = allProductsToDelete.map(product => ({
        id: product.id,
        code: `del_${product.code}_${timestamp}`,
        barcode: product.barcode ? `del_${product.barcode}_${timestamp}` : null
      }))

      // Batch update cho tất cả records
      await Promise.all(
        updateData.map(data =>
          tx.product.update({
            where: { id: data.id },
            data: {
              deletedBy: userId,
              code: data.code,
              barcode: data.barcode,
              deletedAt: new Date()
            },
            select: {
              id: true
            }
          })
        )
      )

      return { count: allIds.length }
    })
  }
}
