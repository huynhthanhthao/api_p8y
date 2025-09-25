import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateMedicineRouteRequestDto } from '@interface-adapter/dtos/medicine-routes'
import { MEDICINE_ROUTE_ERROR } from '@common/errors'
import { MedicineRoute } from '@common/types'

@Injectable()
export class UpdateMedicineRouteUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateMedicineRouteRequestDto,
    userId: string,
    branchId: string
  ): Promise<MedicineRoute> {
    const medicineRoute = await this.prismaClient.medicineRoute.findUnique({
      where: {
        id: id,
        branchId
      }
    })

    if (!medicineRoute) {
      throw new HttpException(HttpStatus.NOT_FOUND, MEDICINE_ROUTE_ERROR.MEDICINE_ROUTE_NOT_FOUND)
    }

    if (data.name && data.name !== medicineRoute.name) {
      const recordWithSameName = await this.prismaClient.medicineRoute.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, MEDICINE_ROUTE_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.medicineRoute.update({
      where: {
        id: id,
        branchId
      },
      data: {
        name: data.name,
        updatedBy: userId
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
