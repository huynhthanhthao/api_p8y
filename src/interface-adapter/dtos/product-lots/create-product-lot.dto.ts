import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsDate,
  IsOptional,
  IsUUID
} from 'class-validator'
import { Transform, TransformFnParams, Type } from 'class-transformer'

export class CreateProductLotRequestDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên sản phẩm không được vượt quá 255 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string

  @IsNotEmpty({ message: 'Ngày hết hạn không được để trống' })
  @Type(() => Date)
  @IsDate({ message: 'Ngày hết hạn không đúng định dạng' })
  expiryAt: string

  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(0, { message: 'Số lượng không được nhỏ hơn 0' })
  quantity: number

  @IsOptional()
  @IsUUID('4', { message: 'ID sản phẩm phải là UUID hợp lệ' })
  productId: string
}
