import { ProvinceResponseDto } from './get-all-province.dto'

export class GetOneProvinceResponseDto extends ProvinceResponseDto {
  constructor(partial: Partial<GetOneProvinceResponseDto>) {
    super()
    Object.assign(this, partial)
  }
}
