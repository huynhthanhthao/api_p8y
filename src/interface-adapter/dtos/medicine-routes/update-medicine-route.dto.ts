import { PartialType } from '@nestjs/swagger'
import { CreateMedicineRouteRequestDto } from './create-medicine-route.dto'

export class UpdateMedicineRouteRequestDto extends PartialType(CreateMedicineRouteRequestDto) {}
