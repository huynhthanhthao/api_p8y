import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Supplier } from '@common/types'
import { HttpException } from '@common/exceptions'
import { SUPPLIER_ERROR } from '@common/errors'

@Injectable()
export class GetOneSupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<Supplier> {
    const supplier = await this.prismaClient.supplier.findUnique({
      where: { id, branchId },
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

    if (!supplier) throw new HttpException(HttpStatus.NOT_FOUND, SUPPLIER_ERROR.SUPPLIER_NOT_FOUND)

    return supplier
  }
}
