import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  UpdateSupplierRequestDto,
  UpdateSupplierResponseDto
} from '@interface-adapter/dtos/suppliers'
import { CUSTOMER_ERROR, CUSTOMER_GROUP_ERROR, SUPPLIER_ERROR } from '@common/errors'
import { generateCodeModel } from '@common/utils'

@Injectable()
export class UpdateSupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateSupplierRequestDto,
    userId: string,
    branchId: string
  ): Promise<UpdateSupplierResponseDto> {
    const supplier = await this.prismaClient.supplier.findUnique({
      where: {
        id: id,
        branchId
      },
      select: {
        id: true,
        phone: true,
        name: true,
        code: true
      }
    })

    if (!supplier) {
      throw new HttpException(HttpStatus.CONFLICT, SUPPLIER_ERROR.SUPPLIER_NOT_FOUND)
    }

    if (data.name && data.name !== supplier.name) {
      const recordWithSameName = await this.prismaClient.supplier.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_GROUP_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    await this.validateUniqueFields(data, branchId, id)

    return this.prismaClient.supplier.update({
      where: {
        id: id,
        branchId
      },
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
    data: UpdateSupplierRequestDto,
    branchId: string,
    currentId: string
  ): Promise<void> {
    const existingSupplier = await this.prismaClient.supplier.findFirst({
      where: {
        id: {
          not: currentId
        },
        OR: [
          {
            code: data.code
          },
          {
            phone: data.phone
          },
          {
            email: data.email
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
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_ERROR.PHONE_ALREADY_EXISTS)
      }

      if (data.code && existingSupplier.code === data.code) {
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_ERROR.CODE_ALREADY_EXISTS)
      }
    }
  }
}
