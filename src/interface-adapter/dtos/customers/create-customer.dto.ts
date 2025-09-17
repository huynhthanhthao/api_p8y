import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  MaxLength,
  ValidateNested,
  IsUUID,
  Matches,
  IsEnum,
  IsDate
} from 'class-validator'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { GenderEnum } from '@common/enums/common.enum'
import { Customer } from '@common/types'

export class CustomerInvoiceInfoRequestDto {
  @IsNotEmpty({ message: 'Tên người mua hàng không được để trống' })
  @IsString({ message: 'Tên người mua hàng phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên người mua hàng không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  buyerName: string

  @IsOptional()
  @IsString({ message: 'Mã số thuế phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã số thuế không được vượt quá 50 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  taxCode: string

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Địa chỉ không được vượt quá 500 ký tự' })
  address: string

  @IsOptional()
  @IsString({ message: 'Tỉnh/Thành phố phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Tỉnh/Thành phố không được vượt quá 100 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  province: string

  @IsOptional()
  @IsString({ message: 'Phường/Xã phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Phường/Xã không được vượt quá 100 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  ward: string

  @IsOptional()
  @IsString({ message: 'Số CMND/CCCD phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Số CMND/CCCD không được vượt quá 50 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  identityNumber: string

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  @Matches(/^[0-9]+$/, { message: 'Số điện thoại chỉ được chứa ký tự số' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone: string

  @IsOptional()
  @IsString({ message: 'Tên ngân hàng phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên ngân hàng không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  bankName: string

  @IsOptional()
  @IsString({ message: 'Số tài khoản ngân hàng phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Số tài khoản ngân hàng không được vượt quá 50 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  bankAccount: string

  @IsOptional()
  @IsString({ message: 'Mã đơn vị ngân sách phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã đơn vị ngân sách không được vượt quá 50 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  budgetUnitCode: string
}

export class CreateCustomerRequestDto {
  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  @IsString({ message: 'Tên khách hàng phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên khách hàng không được vượt quá 255 ký tự' })
  name: string

  @IsOptional()
  @IsString({ message: 'Mã khách hàng phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã khách hàng không được vượt quá 50 ký tự' })
  code: string

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email: string

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  @Matches(/^[0-9]+$/, { message: 'Số điện thoại chỉ được chứa ký tự số' })
  phone: string

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh không đúng định dạng' })
  birthday: Date

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(GenderEnum, {
    message: `Giới tính phải là một trong: ${Object.values(GenderEnum).join(', ')}`
  })
  gender: GenderEnum

  @IsOptional()
  @IsUUID('4', { message: 'ID file là UUID hợp lệ' })
  avatarId: string

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Ghi chú không được vượt quá 500 ký tự' })
  note: string

  @IsOptional()
  @IsUUID('4', { message: 'ID nhóm khách hàng phải là UUID hợp lệ' })
  customerGroupId: string

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerInvoiceInfoRequestDto)
  customerInvoiceInfo: CustomerInvoiceInfoRequestDto
}

export class CreateCustomerResponseDto {
  constructor(entity: Customer) {
    Object.assign(this, {
      entity
    })
  }
}
