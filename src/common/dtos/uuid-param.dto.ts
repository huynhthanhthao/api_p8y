import { IsUUID } from 'class-validator'
export class UUIDParamDto {
  @IsUUID('4', { message: 'ID phải là UUID hợp lệ' })
  id: string
}
