import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

import { MedicineRoute } from '@common/types'

export class CreateMedicineRouteRequestDto {
  @IsNotEmpty({ message: 'Đường dùng không được để trống' })
  @IsString({ message: 'Đường dùng phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Đường dùng không được vượt quá 255 ký tự' })
  name: string
}

export class CreateMedicineRouteResponseDto {
  constructor(entity: MedicineRoute) {
    Object.assign(this, {
      entity
    })
  }
}
