import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { MEDICINE_ROUTE_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyMedicineRouteUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const existingCount = await this.prismaClient.medicineRoute.count({
      where: {
        id: { in: data.ids },
        branchId
      }
    })

    if (existingCount !== data.ids.length) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        MEDICINE_ROUTE_ERROR.SOME_MEDICINE_ROUTES_NOT_FOUND
      )
    }

    return await this.prismaClient.medicineRoute.updateMany({
      where: { id: { in: data.ids }, branchId },
      data: { deletedBy: userId, deletedAt: new Date() }
    })
  }
}
