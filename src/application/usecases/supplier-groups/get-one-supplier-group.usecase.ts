import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { SupplierGroup } from '@common/types'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_GROUP_ERROR } from '@common/errors'

@Injectable()
export class GetOneSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<SupplierGroup> {
    const supplierGroup = await this.prismaClient.supplierGroup.findUnique({
      where: { id, branchId },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })

    if (!supplierGroup)
      throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_GROUP_ERROR.SUPPLIER_GROUP_NOT_FOUND)

    return supplierGroup
  }
}
