import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { MedicineRoute } from '@common/types'
import { HttpException } from '@common/exceptions'
import { MEDICINE_ROUTE_ERROR } from '@common/errors'

@Injectable()
export class GetOneMedicineRouteUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<MedicineRoute> {
    const medicineRoute = await this.prismaClient.medicineRoute.findUnique({
      where: { id, branchId },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!medicineRoute) {
      throw new HttpException(HttpStatus.NOT_FOUND, MEDICINE_ROUTE_ERROR.MEDICINE_ROUTE_NOT_FOUND)
    }

    return medicineRoute
  }
}
