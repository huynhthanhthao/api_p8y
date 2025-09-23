import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  IsEnum,
  IsUUID,
  IsInt,
  ArrayNotEmpty
} from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'
import { GenderEnum, UserStatusEnum, UserTypeEnum } from '@common/enums'

export class CreateUserRequestDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Tên không được vượt quá 100 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  firstName: string

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone: string

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Mật khẩu không được vượt quá 255 ký tự' })
  password: string

  @IsOptional()
  @IsString({ message: 'Họ phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Họ không được vượt quá 100 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lastName: string

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(UserStatusEnum, {
    message: `Trạng thái phải là một trong: ${Object.values(UserStatusEnum).join(', ')}`
  })
  status: UserStatusEnum = UserStatusEnum.ACTIVE

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(UserTypeEnum, {
    message: `Loại người dùng phải là một trong: ${Object.values(UserTypeEnum).join(', ')}`
  })
  type: UserTypeEnum = UserTypeEnum.STAFF

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100, { message: 'Email không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string

  @IsOptional()
  @IsInt({ message: 'Mã huyện phải là số' })
  wardCode: number

  @IsOptional()
  @IsInt({ message: 'Mã tỉnh phải là số' })
  provinceCode: number

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Địa chỉ không được vượt quá 500 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  address: string

  @IsOptional()
  @IsUUID('4', { message: 'ID lô sản phẩm phải là UUID hợp lệ' })
  avatarId: string

  @IsNotEmpty({ message: 'Danh sách chi nhánh không được để trống' })
  @ArrayNotEmpty({ message: 'Danh sách chi nhánh không được để trống' })
  @IsUUID('4', { each: true, message: 'ID chi nhánh phải là UUID hợp lệ' })
  branchIds: string[]

  @IsNotEmpty({ message: 'Danh sách vai trò không được để trống' })
  @ArrayNotEmpty({ message: 'Danh sách vai trò không được để trống' })
  @IsUUID('4', { each: true, message: 'ID vai trò phải là UUID hợp lệ' })
  roleIds: string[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(GenderEnum, {
    message: `Giới tính phải là một trong: ${Object.values(GenderEnum).join(', ')}`
  })
  gender: GenderEnum
}
