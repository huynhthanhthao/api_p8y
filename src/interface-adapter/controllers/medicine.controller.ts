import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { GetAllMedicineUseCase } from '@usecases/medicines'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { Medicine } from '@common/types'
import { GetAllMedicineRequestDto } from '@interface-adapter/dtos/medicines'

@Controller('medicines')
@UseGuards(AccessTokenGuard)
export class MedicineController {
  constructor(private readonly _getAllMedicineUseCase: GetAllMedicineUseCase) {}

  @Get()
  getAll(@Query() queryParams: GetAllMedicineRequestDto) {
    return this._getAllMedicineUseCase.execute(queryParams)
  }
}
