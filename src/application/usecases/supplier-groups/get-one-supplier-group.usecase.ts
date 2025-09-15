import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { SupplierGroup } from '@common/types'

@Injectable()
export class GetOneSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<SupplierGroup> {
    return await this.prismaClient.supplierGroup.findUniqueOrThrow({
      where: { id, branchId },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })
  }
}
