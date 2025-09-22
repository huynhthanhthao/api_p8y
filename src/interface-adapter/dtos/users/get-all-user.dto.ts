import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { User } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'

export class GetAllUserRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  roleIds: string[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  branchIds: string[]
}

export class GetAllUserResponseDto extends PaginationResponseDto<User> {
  constructor(partial: Partial<GetAllUserResponseDto>) {
    super(partial)
  }
}
