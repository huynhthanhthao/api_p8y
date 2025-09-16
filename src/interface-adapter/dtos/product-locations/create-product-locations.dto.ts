import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

import { ProductLocation } from '@common/types'

export class CreateProductLocationRequestDto {
  @IsNotEmpty({ message: 'Vị trí không được để trống' })
  @IsString({ message: 'Vị trí phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Vị trí không được vượt quá 255 ký tự' })
  name: string
}

export class CreateProductLocationResponseDto {
  constructor(entity: ProductLocation) {
    Object.assign(this, {
      entity
    })
  }
}
