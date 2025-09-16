import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  CreateManufacturerRequestDto,
  CreateManufacturerResponseDto
} from '@interface-adapter/dtos/manufacturers'
import { MANUFACTURER_ERROR } from '@common/errors'

@Injectable()
export class CreateManufacturerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateManufacturerRequestDto,
    userId: string,
    branchId: string
  ): Promise<CreateManufacturerResponseDto> {
    const existingRecord = await this.prismaClient.manufacturer.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        branchId
      }
    })

    if (existingRecord)
      throw new HttpException(HttpStatus.CONFLICT, MANUFACTURER_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.manufacturer.create({
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
