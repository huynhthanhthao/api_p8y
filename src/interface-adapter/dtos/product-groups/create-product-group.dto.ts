import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class CreateProductGroupRequestDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên sản phẩm không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string

  @IsOptional()
  @IsUUID('4', { message: 'ID nhóm cha phải là UUID hợp lệ' })
  parentId: string
}
