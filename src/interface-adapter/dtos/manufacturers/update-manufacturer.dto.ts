import { PartialType } from '@nestjs/swagger'
import { CreateManufacturerRequestDto } from './create-manufacturer.dto'

export class UpdateManufacturerRequestDto extends PartialType(CreateManufacturerRequestDto) {}
