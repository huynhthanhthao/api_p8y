import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { SupplierGroup } from '@common/types'

@Injectable()
export class GetOneSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, storeCode: string): Promise<SupplierGroup> {
    return await this.prismaClient.supplierGroup.findUniqueOrThrow({
      where: { id, storeCode },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })
  }
}
