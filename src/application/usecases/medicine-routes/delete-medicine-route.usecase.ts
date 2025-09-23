import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { MEDICINE_ROUTE_ERROR } from '@common/errors'

@Injectable()
export class DeleteMedicineRouteUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const medicineRoute = await this.prismaClient.medicineRoute.findUnique({
      where: { id, branchId }
    })

    if (!medicineRoute) {
      throw new HttpException(HttpStatus.NOT_FOUND, MEDICINE_ROUTE_ERROR.MEDICINE_ROUTE_NOT_FOUND)
    }

    await this.prismaClient.medicineRoute.update({
      where: { id, branchId },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.medicineRoute.delete({
      where: {
        id,
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

    return id
  }
}
