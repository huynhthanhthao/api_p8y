import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { Prisma } from '@prisma/client'
import { HttpException } from '@common/exceptions'
import { generateTimesTamp } from '@common/helpers'
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

    // Cập nhật thông tin trước khi xóa (đánh dấu đã xóa và thay đổi các trường duy nhất)
    const updatePromises = suppliers.map(supplier =>
      this.prismaClient.supplier.update({
        where: { id: supplier.id, branchId },
        data: {
          deletedBy: userId,
          code: `del_${supplier.code}_${generateTimesTamp()}`,
          phone: supplier.phone ? `del_${supplier.phone}_${generateTimesTamp()}` : null,
          deletedAt: new Date()
        }
      })
    )

    await Promise.all(updatePromises)

    return { count: suppliers.length }
  }
}
