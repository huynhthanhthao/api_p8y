import { PartialType } from '@nestjs/swagger'
import { CreateMedicineRouteRequestDto } from './create-medicine-routes.dto'

export class UpdateMedicineRouteRequestDto extends PartialType(CreateMedicineRouteRequestDto) {}
