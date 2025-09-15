import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_GROUP_ERROR } from '@common/errors'

@Injectable()
export class DeleteSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const supplierGroup = await this.prismaClient.supplierGroup.findUnique({
      where: { id, branchId }
    })

    if (!supplierGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_GROUP_ERROR.SUPPLIER_GROUP_NOT_FOUND)
    }

    await this.prismaClient.supplierGroup.update({
      where: {
        id,
        branchId
      },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.supplierGroup.delete({
      where: {
        id,
        branchId
      }
    })

    return id
  }
}
