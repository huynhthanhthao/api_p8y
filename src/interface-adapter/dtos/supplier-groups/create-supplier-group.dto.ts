import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class CreateSupplierGroupRequestDto {
  @IsNotEmpty({ message: 'Tên nhóm nhà cung cấp không được để trống' })
  @IsString({ message: 'Tên nhóm nhà cung cấp phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(255, { message: 'Tên nhóm nhà cung cấp không được vượt quá 255 ký tự' })
  name: string

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Tên nhóm nhà cung cấp không được vượt quá 500 ký tự' })
  note: string
}
