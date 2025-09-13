import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Province } from '@common/types/province.type'

@Injectable()
export class GetOneProvinceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(code: number): Promise<Province> {
    return await this.prisma.province.findUniqueOrThrow({
      where: { code },
      include: { wards: true }
    })
  }
}
