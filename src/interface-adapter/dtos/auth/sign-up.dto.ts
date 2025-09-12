import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignUpRequestDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone: string

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string

  @IsNotEmpty({ message: 'Tên cửa hàng không được để trống' })
  @IsString({ message: 'Tên cửa hàng phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  storeName: string

  @IsNotEmpty({ message: 'Khu vực không được để trống' })
  @IsInt({ message: 'Khu vực phải là số' })
  provinceCode: number
}

export class SignUpResponseDto {
  storeCode: string
}
