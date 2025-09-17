import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  IsNumber,
  IsEnum,
  ValidateNested
} from 'class-validator'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { DiscountTypeEnum, PaymentMethodCodeEnum } from '@common/enums'
import { InvoiceStatusEnum } from '@common/enums'
import { Invoice } from '@common/types/invoice.type'

export class CreateInvoiceItemRequestDto {
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsUUID('4', { message: 'ID sản phẩm phải là UUID hợp lệ' })
  productId: string

  @IsOptional()
  @IsUUID('4', { message: 'ID lô sản phẩm phải là UUID hợp lệ' })
  productLotId: string

  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  quantity: number

  @IsNotEmpty({ message: 'Đơn giá không được để trống' })
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  salePrice: number

  @IsOptional()
  @IsNumber({}, { message: 'Giá trị giảm giá phải là số' })
  discountValue: number

  @IsOptional()
  @IsEnum(DiscountTypeEnum, {
    message: `Loại giảm giá phải là một trong: ${Object.values(DiscountTypeEnum).join(', ')}`
  })
  discountType: DiscountTypeEnum

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Ghi chú không được vượt quá 500 ký tự' })
  note: string
}

export class CreateInvoiceRequestDto {
  @IsOptional()
  @IsString({ message: 'Mã hóa đơn phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã hóa đơn không được vượt quá 50 ký tự' })
  code: string

  @IsOptional()
  @IsEnum(InvoiceStatusEnum, {
    message: `Trạng thái phải là một trong: ${Object.values(InvoiceStatusEnum).join(', ')}`
  })
  status: InvoiceStatusEnum

  @IsOptional()
  @IsNumber({}, { message: 'Giá trị giảm giá phải là số' })
  discountValue: number

  @IsOptional()
  @IsEnum(DiscountTypeEnum, {
    message: `Loại giảm giá phải là một trong: ${Object.values(DiscountTypeEnum).join(', ')}`
  })
  discountType: DiscountTypeEnum

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  note: string

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(PaymentMethodCodeEnum, {
    message: `Mã phương thức thanh toán phải là một trong: ${Object.values(PaymentMethodCodeEnum).join(', ')}`
  })
  paymentMethodCode: PaymentMethodCodeEnum

  @IsOptional()
  @IsUUID('4', { message: 'ID khách hàng phải là UUID hợp lệ' })
  customerId: string

  @IsNotEmpty({ message: 'Hóa đơn phải có ít nhất một sản phẩm' })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemRequestDto)
  invoiceItems: CreateInvoiceItemRequestDto[]
}
