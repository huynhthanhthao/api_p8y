import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { CustomerGroup } from '@common/types'

@Injectable()
@Injectable()
export class GetOneCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string): Promise<CustomerGroup> {
    return await this.prismaClient.customerGroup.findUniqueOrThrow({
      where: { id },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })
  }
}
