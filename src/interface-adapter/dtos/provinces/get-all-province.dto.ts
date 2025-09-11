import { IsInt, IsString, IsNotEmpty, MaxLength } from 'class-validator'
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto'
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto'

export class GetAllProvincesRequestDto extends PaginationQueryDto {}

export class ProvinceResponseDto {
  @IsInt()
  code: number

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  divisionType: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codeName: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phoneCode: string
}

export class GetAllProvincesResponseDto extends PaginationResponseDto<ProvinceResponseDto> {
  constructor(partial: Partial<GetAllProvincesResponseDto>) {
    super(partial)
  }
}
