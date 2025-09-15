import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_GROUP_ERROR } from '@common/errors'
import {
  CreateSupplierGroupRequestDto,
  CreateSupplierGroupResponseDto
} from '@interface-adapter/dtos/supplier-groups'
import { SUPPLIER_GROUP_ERROR } from '@common/errors/supplier-group.error'

@Injectable()
export class CreateSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateSupplierGroupRequestDto,
    userId: string,
    storeCode: string
  ): Promise<CreateSupplierGroupResponseDto> {
    const existingGroup = await this.prismaClient.supplierGroup.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        storeCode
      }
    })

    if (existingGroup)
      throw new HttpException(HttpStatus.CONFLICT, SUPPLIER_GROUP_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.supplierGroup.create({
      data: {
        name: data.name,
        note: data.note,
        createdBy: userId,
        storeCode
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
