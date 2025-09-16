import { PartialType } from '@nestjs/swagger'
import { Manufacturer } from '@common/types'
import { CreateManufacturerRequestDto } from './create-manufacturer.dto'

export class UpdateManufacturerRequestDto extends PartialType(CreateManufacturerRequestDto) {}

export class UpdateManufacturerResponseDto {
  constructor(entity: Manufacturer) {
    Object.assign(this, {
      entity
    })
  }
}
