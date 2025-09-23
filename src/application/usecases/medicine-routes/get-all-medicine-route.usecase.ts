import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllMedicineRouteRequestDto,
  GetAllMedicineRouteResponseDto
} from '@interface-adapter/dtos/medicine-routes'

@Injectable()
export class GetAllMedicineRouteUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllMedicineRouteRequestDto,
    branchId: string
  ): Promise<GetAllMedicineRouteResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = data

    const where: Prisma.MedicineRouteWhereInput = {
      branchId
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'medicineRoute',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true,
          createdAt: true,
          updatedAt: true
        }
      },
      { page, perPage }
    )
  }
}
