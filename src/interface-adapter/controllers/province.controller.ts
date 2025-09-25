import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetAllProvinceUseCase, GetOneProvinceUseCase } from '@usecases/provinces'
import { GetAllProvinceRequestDto, GetAllProvinceResponseDto } from '../dtos/provinces'
import { Province } from '@prisma/client'

@Controller('provinces')
export class ProvinceController {
  constructor(
    private readonly _getAllProvinceUseCase: GetAllProvinceUseCase,
    private readonly _getOneProvinceUseCase: GetOneProvinceUseCase
  ) {}

  @Get()
  getAllProvinces(
    @Query() queryParams: GetAllProvinceRequestDto
  ): Promise<GetAllProvinceResponseDto> {
    return this._getAllProvinceUseCase.execute(queryParams)
  }

  @Get(':code')
  getOneProvince(@Param('code') code: number): Promise<Province> {
    return this._getOneProvinceUseCase.execute(code)
  }
}
