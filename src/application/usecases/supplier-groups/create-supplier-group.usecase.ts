import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateSupplierGroupRequestDto } from '@interface-adapter/dtos/supplier-groups'
import { SUPPLIER_GROUP_ERROR } from '@common/errors'
import { SupplierGroup } from '@common/types'

@Injectable()
export class CreateSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateSupplierGroupRequestDto,
    userId: string,
    branchId: string
  ): Promise<SupplierGroup> {
    const existingGroup = await this.prismaClient.supplierGroup.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        branchId
      }
    })

    if (existingGroup)
      throw new HttpException(HttpStatus.CONFLICT, SUPPLIER_GROUP_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.supplierGroup.create({
      data: {
        name: data.name,
        note: data.note,
        createdBy: userId,
        branchId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })
  }
}
