import { IsString, IsNotEmpty, MaxLength, IsEnum, IsBoolean, ValidateIf } from 'class-validator'

import { Transform, TransformFnParams } from 'class-transformer'
import { PaymentMethodCodeEnum } from '@common/enums'

export class UpsertPaymentMethodRequestDto {
  @IsNotEmpty({ message: 'Mã phương thức không được để trống' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(PaymentMethodCodeEnum, {
    message: `Mã phương thức phải là một trong: ${Object.values(PaymentMethodCodeEnum).join(', ')}`
  })
  code: PaymentMethodCodeEnum

  @ValidateIf(o => o.code === PaymentMethodCodeEnum.BANK_TRANSFER)
  @IsNotEmpty({ message: 'Tên chủ tài khoản không được để trống' })
  @IsString({ message: 'Tên chủ tài khoản phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(255, { message: 'Tên chủ tài khoản không được vượt quá 255 ký tự' })
  bankAccountHolder: string

  @ValidateIf(o => o.code === PaymentMethodCodeEnum.BANK_TRANSFER)
  @IsNotEmpty({ message: 'Mã bin không được để trống' })
  @IsString({ message: 'Mã bin phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(20, { message: 'Mã bin không được vượt quá 20 ký tự' })
  bankBin: string

  @ValidateIf(o => o.code === PaymentMethodCodeEnum.BANK_TRANSFER)
  @IsNotEmpty({ message: 'Mã ngân hàng không được để trống' })
  @IsString({ message: 'Mã ngân hàng phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã ngân hàng không được vượt quá 50 ký tự' })
  bankShortName: string

  @ValidateIf(o => o.code === PaymentMethodCodeEnum.BANK_TRANSFER)
  @IsNotEmpty({ message: 'Số tài khoản không được để trống' })
  @IsString({ message: 'Số tài khoản phải là chuỗi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Số tài khoảnkhông được vượt quá 50 ký tự' })
  bankAccount: string

  @ValidateIf(o => o.code === PaymentMethodCodeEnum.BANK_TRANSFER)
  @IsNotEmpty({ message: 'Trạng thái sử dụng không được để trống' })
  @IsBoolean({ message: 'Trạng thái sử dụng' })
  isActive: boolean
}
