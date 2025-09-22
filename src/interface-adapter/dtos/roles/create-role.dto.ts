import { IsString, IsNotEmpty, MaxLength, IsUUID, ArrayNotEmpty } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class CreateRoleRequestDto {
  @IsNotEmpty({ message: 'Tên nhóm quyền không được để trống' })
  @IsString({ message: 'Tên nhóm quyền phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên nhóm quyền không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string

  @IsNotEmpty({ message: 'Danh sách chức năng không được để trống' })
  @ArrayNotEmpty({ message: 'Danh sách chức năng không được để trống' })
  permissionIds: string[]
}
