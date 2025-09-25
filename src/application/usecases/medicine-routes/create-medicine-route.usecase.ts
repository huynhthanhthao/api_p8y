import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateMedicineRouteRequestDto } from '@interface-adapter/dtos/medicine-routes'
import { MEDICINE_ROUTE_ERROR } from '@common/errors'
import { MedicineRoute } from '@common/types'

@Injectable()
export class CreateMedicineRouteUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateMedicineRouteRequestDto,
    userId: string,
    branchId: string
  ): Promise<MedicineRoute> {
    const existingRecord = await this.prismaClient.medicineRoute.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        branchId
      }
    })

    if (existingRecord)
      throw new HttpException(HttpStatus.CONFLICT, MEDICINE_ROUTE_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.medicineRoute.create({
      data: {
        name: data.name,
        createdBy: userId,
        branchId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }
}
