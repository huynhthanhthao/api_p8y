import { DiscountTypeEnum } from '@common/enums'
import { CustomerGroup } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsString, IsNotEmpty, MaxLength, IsNumber, IsOptional, IsEnum } from 'class-validator'

export class CreateCustomerGroupRequestDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString({ message: 'Tên phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(255, { message: 'Tên không được vượt quá 255 ký tự' })
  name: string

  @IsOptional()
  @IsNumber({}, { message: 'Giá trị giảm giá phải là số' })
  discountValue: number

  @IsOptional()
  @IsEnum(DiscountTypeEnum, {
    message: `Loại giảm giá phải là một trong: ${Object.values(DiscountTypeEnum).join(', ')}`
  })
  discountType: DiscountTypeEnum
}

export class CreateCustomerGroupResponseDto {
  constructor(entity: CustomerGroup) {
    Object.assign(this, {
      entity
    })
  }
}
