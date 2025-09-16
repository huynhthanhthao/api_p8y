import { PartialType } from '@nestjs/swagger'
import { MedicineRoute } from '@common/types'
import { CreateMedicineRouteRequestDto } from './create-medicine-routes.dto'

export class UpdateMedicineRouteRequestDto extends PartialType(CreateMedicineRouteRequestDto) {}

export class UpdateMedicineRouteResponseDto {
  constructor(entity: MedicineRoute) {
    Object.assign(this, {
      entity
    })
  }
}
