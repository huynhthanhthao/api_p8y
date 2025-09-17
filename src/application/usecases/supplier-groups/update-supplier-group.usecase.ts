import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { UpdateSupplierGroupRequestDto } from '@interface-adapter/dtos/supplier-groups'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_GROUP_ERROR } from '@common/errors'
import { SupplierGroup } from '@common/types'

@Injectable()
export class UpdateSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateSupplierGroupRequestDto,
    userId: string,
    branchId: string
  ): Promise<SupplierGroup> {
    const supplierGroup = await this.prismaClient.supplierGroup.findUnique({
      where: {
        id: id,
        branchId
      }
    })

    if (!supplierGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_GROUP_ERROR.SUPPLIER_GROUP_NOT_FOUND)
    }

    if (data.name && data.name !== supplierGroup.name) {
      const recordWithSameName = await this.prismaClient.supplierGroup.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          },
          branchId
        }
      })

      if (recordWithSameName) {
        throw new HttpException(HttpStatus.CONFLICT, SUPPLIER_GROUP_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.supplierGroup.update({
      where: {
        id: id,
        branchId
      },
      data: {
        name: data.name,
        note: data.note,
        updatedBy: userId
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
