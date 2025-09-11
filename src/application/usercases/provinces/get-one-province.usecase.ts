import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/prisma'
import { GetOneProvinceResponseDto } from 'src/interface-adapter/dtos/provinces/get-one-province.dto'

@Injectable()
export class GetOneProvinceUseCase {
  constructor(private readonly prisma: PrismaService) { }

  async execute(code: number): Promise<GetOneProvinceResponseDto> {
    return await this.prisma.province.findUniqueOrThrow({
      where: { code },
      include: { wards: true }
    })
  }
}
