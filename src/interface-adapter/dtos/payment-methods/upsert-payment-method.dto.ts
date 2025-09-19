import { IsString, IsNotEmpty, MaxLength, IsEnum, IsBoolean, IsOptional } from 'class-validator'

import { Transform, TransformFnParams } from 'class-transformer'
import { PaymentMethodCodeEnum } from '@common/enums'

export class UpsertPaymentMethodRequestDto {
  @IsNotEmpty({ message: 'Mã phương thức không được để trống' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(PaymentMethodCodeEnum, {
    message: `Mã phương thức phải là một trong: ${Object.values(PaymentMethodCodeEnum).join(', ')}`
  })
  code: PaymentMethodCodeEnum

  @IsOptional()
  @IsString({ message: 'Tên chủ tài khoản phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(255, { message: 'Tên chủ tài khoản không được vượt quá 255 ký tự' })
  bankAccountHolder: string

  @IsOptional()
  @IsString({ message: 'Mã bin phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(20, { message: 'Mã bin không được vượt quá 20 ký tự' })
  bankBin: string

  @IsOptional()
  @IsString({ message: 'Mã ngân hàng phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã ngân hàng không được vượt quá 50 ký tự' })
  bankShortName: string

  @IsOptional()
  @IsString({ message: 'Số tài khoản phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Số tài khoảnkhông được vượt quá 50 ký tự' })
  bankAccount: string

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái sử dụng' })
  isActive: boolean
}
