import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Manufacturer } from '@common/types'
import { HttpException } from '@common/exceptions'
import { MANUFACTURER_ERROR } from '@common/errors'

@Injectable()
@Injectable()
export class GetOneManufacturerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<Manufacturer> {
    const manufacturer = await this.prismaClient.manufacturer.findUnique({
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

    if (!manufacturer) {
      throw new HttpException(HttpStatus.NOT_FOUND, MANUFACTURER_ERROR.MANUFACTURER_NOT_FOUND)
    }

    return manufacturer
  }
}
