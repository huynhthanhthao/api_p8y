import { Transform, TransformFnParams, Type } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  IsEnum,
  IsNumber,
  Min,
  ValidateNested,
  IsArray,
  IsDate,
  IsBoolean,
  IsInt
} from 'class-validator'
import {
  DiscountTypeEnum,
  StockTransactionStatusEnum,
  StockTransactionTypeEnum
} from '@common/enums'

export class StockItemRequestDto {
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsUUID('4', { message: 'ID sản phẩm phải là UUID hợp lệ' })
  productId: string

  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(0, { message: 'Số lượng không được nhỏ hơn 0' })
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  quantity: number

  @IsNotEmpty({ message: 'Đơn giá không được để trống' })
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  @Min(0, { message: 'Đơn giá không được nhỏ hơn 0' })
  unitPrice: number

  @IsOptional()
  @IsEnum(DiscountTypeEnum, {
    message: `Loại chiết khấu phải là một trong: ${Object.values(DiscountTypeEnum).join(', ')}`
  })
  discountType: DiscountTypeEnum

  @IsOptional()
  @IsNumber({}, { message: 'Giá trị chiết khấu phải là số' })
  @Min(0, { message: 'Giá trị chiết khấu không được nhỏ hơn 0' })
  discountValue: number

  @IsOptional()
  @IsNotEmpty({ message: 'ID lô sản phẩm không được để trống' })
  @IsUUID('4', { message: 'ID lô sản phẩm phải là UUID hợp lệ' })
  productLotId: string
}

export class CreateStockTransactionRequestDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(StockTransactionStatusEnum, {
    message: `Trạng thái phải là một trong: ${Object.values(StockTransactionStatusEnum).join(', ')}`
  })
  status: StockTransactionStatusEnum

  @IsOptional()
  @IsString({ message: 'Mã giao dịch phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã giao dịch không được vượt quá 50 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  code: string

  @IsNotEmpty({ message: 'Loại giao dịch không được để trống' })
  @IsString({ message: 'Loại giao dịch phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Loại giao dịch không được vượt quá 50 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type: StockTransactionTypeEnum

  @IsOptional()
  @IsEnum(DiscountTypeEnum, {
    message: `Loại chiết khấu phải là một trong: ${Object.values(DiscountTypeEnum).join(', ')}`
  })
  discountType: DiscountTypeEnum

  @IsOptional()
  @IsNumber({}, { message: 'Giá trị chiết khấu phải là số' })
  @Min(0, { message: 'Giá trị chiết khấu không được nhỏ hơn 0' })
  discountValue: number

  @IsOptional()
  @IsUUID('4', { message: 'ID nhà cung cấp phải là UUID hợp lệ' })
  supplierId: string

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Ghi chú không được vượt quá 500 ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  note: string

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Thời gian giao dịch không đúng định dạng' })
  transactedAt: Date

  @IsNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  @IsArray({ message: 'Danh sách sản phẩm phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => StockItemRequestDto)
  stockItems: StockItemRequestDto[]
}
