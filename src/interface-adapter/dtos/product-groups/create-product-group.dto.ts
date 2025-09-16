import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator'

import { ProductGroup } from '@common/types'

export class CreateProductGroupRequestDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên sản phẩm không được vượt quá 255 ký tự' })
  name: string

  @IsOptional()
  @IsUUID('4', { message: 'ID nhóm cha phải là UUID hợp lệ' })
  parentId: string
}

export class CreateProductGroupResponseDto {
  constructor(entity: ProductGroup) {
    Object.assign(this, {
      entity
    })
  }
}
