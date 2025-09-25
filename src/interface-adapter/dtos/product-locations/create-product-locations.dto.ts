import { IsString, IsNotEmpty, MaxLength } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class CreateProductLocationRequestDto {
  @IsNotEmpty({ message: 'Vị trí không được để trống' })
  @IsString({ message: 'Vị trí phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Vị trí không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string
}
