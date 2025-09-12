import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { StoreWithBranches, UserBasicInfo } from '@common/types'

export class SignInRequestDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
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
