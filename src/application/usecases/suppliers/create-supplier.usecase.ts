import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_ERROR } from '@common/errors'
import {
  CreateSupplierRequestDto,
  CreateSupplierResponseDto
} from '@interface-adapter/dtos/suppliers'
import { generateCodeModel } from '@common/utils'

@Injectable()
export class CreateSupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateSupplierRequestDto,
    userId: string,
    branchId: string
  ): Promise<CreateSupplierResponseDto> {
    await this.validateUniqueFields(data, branchId)

    return await this.prismaClient.supplier.create({
      data: {
        name: data.name,
        code: data.code || (await generateCodeModel({ model: 'Supplier', branchId })),
        email: data.email,
        phone: data.phone,
        tax: data.tax,
        supplierGroupId: data.supplierGroupId,
        branchId: branchId,
        createdBy: userId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      },
      include: {
        supplierGroup: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        }
      }
    })
  }

  private async validateUniqueFields(
    data: CreateSupplierRequestDto,
    branchId: string
  ): Promise<void> {
    const existingSupplier = await this.prismaClient.supplier.findFirst({
      where: {
        OR: [
          {
            code: data.code
          },
          {
            phone: data.phone
          }
        ],
        branchId
      },
      select: {
        phone: true,
        email: true,
        code: true
      }
    })

    if (existingSupplier) {
      if (data.phone && existingSupplier.phone === data.phone) {
        throw new HttpException(HttpStatus.CONFLICT, SUPPLIER_ERROR.PHONE_ALREADY_EXISTS)
      }

      if (data.code && existingSupplier.code === data.code) {
        throw new HttpException(HttpStatus.CONFLICT, SUPPLIER_ERROR.CODE_ALREADY_EXISTS)
      }
    }
  }
}
