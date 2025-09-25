import { PartialType } from '@nestjs/swagger'
import { CreateRoleRequestDto } from './create-role.dto'

export class UpdateRoleRequestDto extends PartialType(CreateRoleRequestDto) {}
