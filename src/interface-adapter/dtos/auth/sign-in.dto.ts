import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { StoreWithBranches, UserBasicInfo } from '@common/types'

export class SignInRequestDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^0\d{9,10}$/, { message: 'Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số' })
  phone: string

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  password: string

  @IsNotEmpty({ message: 'Mã cửa hàng không được để trống' })
  @IsString({ message: 'Mã cửa hàng phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  storeCode: string
}

export class SignInResponseDto {
  signInToken: string
  store: StoreWithBranches
  user: UserBasicInfo
}
