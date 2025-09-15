import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Supplier } from '@common/types'

@Injectable()
export class GetOneSupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<Supplier> {
    return await this.prismaClient.supplier.findUniqueOrThrow({
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
  }
}
