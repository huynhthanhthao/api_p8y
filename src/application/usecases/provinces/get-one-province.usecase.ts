import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Province } from '@common/types/province.type'
import { HttpException } from '@common/exceptions'
import { PROVINCE_ERROR } from '@common/errors/province.error'

@Injectable()
export class GetOneProvinceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(code: number): Promise<Province> {
    const province = await this.prisma.province.findUnique({
      where: { code },
      include: { wards: true }
    })

    if (!province) {
      throw new HttpException(HttpStatus.NOT_FOUND, PROVINCE_ERROR.PROVINCE_NOT_FOUND)
    }

    return province
  }
}
