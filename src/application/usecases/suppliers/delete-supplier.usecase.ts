import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { generateTimesTamp } from '@common/helpers'
import { SUPPLIER_ERROR } from '@common/errors'

@Injectable()
export class DeleteSupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const supplier = await this.prismaClient.supplier.findUnique({
      where: { id, branchId }
    })

    if (!supplier) {
      throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_ERROR.SUPPLIER_NOT_FOUND)
    }

    await this.prismaClient.supplier.update({
      where: { id, branchId },
      data: {
        code: `del_${supplier.code}_${generateTimesTamp()}`,
        phone: supplier.phone ? `del_${supplier.phone}_${generateTimesTamp()}` : null,
        deletedBy: userId
      }
    })

    await this.prismaClient.supplier.delete({
      where: {
        id,
        branchId
      }
    })

    return id
  }
}
