import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  page: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  perPage: number = 20

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  keyword: string

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase())
  sortBy: string

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase())
  order: 'asc' | 'desc'
}
