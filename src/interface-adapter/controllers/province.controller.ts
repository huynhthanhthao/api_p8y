// src/interface-adapter/controllers/province/province.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetAllProvincesRequestDto } from '../dtos/provinces'
import { GetAllProvinceUseCase, GetOneProvinceUseCase } from 'src/application/usercases/provinces'

@Controller('provinces')
export class ProvinceController {
  constructor(
    private readonly _getAllProvinceUseCase: GetAllProvinceUseCase,
    private readonly _getOneProvinceUseCase: GetOneProvinceUseCase
  ) { }

  @Get()
  getAllProvinces(@Query() queryParams: GetAllProvincesRequestDto) {
    return this._getAllProvinceUseCase.execute(queryParams)
  }

  @Get(':code')
  getOneProvince(@Param('code') code: number) {
    return this._getOneProvinceUseCase.execute(code)
  }
}
