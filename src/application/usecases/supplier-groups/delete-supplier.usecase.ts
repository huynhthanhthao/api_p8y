import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_GROUP_ERROR } from '@common/errors/supplier-group.error'

@Injectable()
export class DeleteSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, storeCode: string): Promise<string> {
    const customer = await this.prismaClient.supplierGroup.findUnique({
      where: { id, storeCode }
    })

    if (!customer) {
      throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_GROUP_ERROR.SUPPLIER_GROUP_NOT_FOUND)
    }

    await this.prismaClient.supplierGroup.update({
      where: {
        id,
        storeCode
      },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.supplierGroup.delete({
      where: {
        id,
        storeCode
      }
    })

    return id
  }
}
