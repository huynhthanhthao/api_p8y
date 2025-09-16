import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

import { Manufacturer } from '@common/types'

export class CreateManufacturerRequestDto {
  @IsNotEmpty({ message: 'Tên hãng sản xuất không được để trống' })
  @IsString({ message: 'Tên hãng sản xuất phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên hãng sản xuất không được vượt quá 255 ký tự' })
  name: string
}

export class CreateManufacturerResponseDto {
  constructor(entity: Manufacturer) {
    Object.assign(this, {
      entity
    })
  }
}
