import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { MANUFACTURER_ERROR } from '@common/errors'

@Injectable()
export class DeleteManufacturerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const manufacturer = await this.prismaClient.manufacturer.findUnique({
      where: { id, branchId }
    })

    if (!manufacturer) {
      throw new HttpException(HttpStatus.NOT_FOUND, MANUFACTURER_ERROR.MANUFACTURER_NOT_FOUND)
    }

    await this.prismaClient.manufacturer.update({
      where: { id, branchId },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.manufacturer.delete({
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
