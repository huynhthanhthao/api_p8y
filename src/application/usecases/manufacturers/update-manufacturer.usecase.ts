import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateManufacturerRequestDto } from '@interface-adapter/dtos/manufacturers'
import { MANUFACTURER_ERROR } from '@common/errors'
import { Manufacturer } from '@common/types'

@Injectable()
export class UpdateManufacturerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateManufacturerRequestDto,
    userId: string,
    branchId: string
  ): Promise<Manufacturer> {
    const manufacturer = await this.prismaClient.manufacturer.findUnique({
      where: {
        id: id,
        branchId
      }
    })

    if (!manufacturer) {
      throw new HttpException(HttpStatus.NOT_FOUND, MANUFACTURER_ERROR.MANUFACTURER_NOT_FOUND)
    }

    if (data.name && data.name !== manufacturer.name) {
      const recordWithSameName = await this.prismaClient.manufacturer.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, MANUFACTURER_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.manufacturer.update({
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
