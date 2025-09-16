import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { MANUFACTURER_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyManufacturerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const existingCount = await this.prismaClient.manufacturer.count({
      where: {
        id: { in: data.ids },
        branchId
      }
    })

    if (existingCount !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, MANUFACTURER_ERROR.SOME_MANUFACTURERS_NOT_FOUND)
    }

    await this.prismaClient.manufacturer.updateMany({
      where: { id: { in: data.ids }, branchId },
      data: { deletedBy: userId }
    })

    return await this.prismaClient.manufacturer.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
