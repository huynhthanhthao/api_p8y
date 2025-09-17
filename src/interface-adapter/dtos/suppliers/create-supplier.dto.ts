import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEmail,
  IsUUID,
  Matches
} from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class CreateSupplierRequestDto {
  @IsNotEmpty({ message: 'Tên nhà cung cấp không được để trống' })
  @IsString({ message: 'Tên nhà cung cấp phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(255, { message: 'Tên nhà cung cấp không được vượt quá 255 ký tự' })
  name: string

  @IsOptional()
  @IsString({ message: 'Mã nhà cung cấp phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã nhà cung cấp không được vượt quá 50 ký tự' })
  code: string

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email: string

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  @Matches(/^[0-9]+$/, { message: 'Số điện thoại chỉ được chứa ký tự số' })
  phone: string

  @IsOptional()
  @IsString({ message: 'Mã số thuế phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(20, { message: 'Mã số thuế không được vượt quá 20 ký tự' })
  tax: string

  @IsOptional()
  @IsUUID('4', { message: 'ID file là UUID hợp lệ' })
  supplierGroupId: string
}
