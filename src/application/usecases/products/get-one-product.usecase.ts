import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Product } from '@common/types'
import { getProductById } from '@common/utils/get-product-by-id.util'

@Injectable()
@Injectable()
export class GetOneProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<Product> {
    return await getProductById(this.prismaClient, id, branchId)
  }
}
