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
  IsBoolean,
  IsInt
} from 'class-validator'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { ProductTypeEnum, ProductWeightUnitEnum } from '@common/enums/product.enum'

class ProductWeightRequestDto {
  @IsOptional()
  @IsEnum(ProductWeightUnitEnum, {
    message: `Đơn vị phải là một trong: ${Object.values(ProductWeightUnitEnum).join(', ')}`
  })
  unit: ProductWeightUnitEnum

  @IsOptional()
  @IsNumber({}, { message: 'Giá trị trọng lượng phải là số' })
  @Min(0, { message: 'Giá trị trọng lượng không được nhỏ hơn 0' })
  value: number
}

class MedicineInfoRequestDto {
  @IsOptional()
  @IsString({ message: 'Số đăng ký phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Số đăng ký không được vượt quá 500 ký tự' })
  regNumber: string

  @IsOptional()
  @IsString({ message: 'Hoạt chất phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Hoạt chất không được vượt quá 500 ký tự' })
  ingredient: string

  @IsOptional()
  @IsString({ message: 'Hàm lượng phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Hàm lượng không được vượt quá 500 ký tự' })
  dosage: string

  @IsOptional()
  @IsUUID('4', { message: 'ID đường dùng phải là UUID hợp lệ' })
  routeId: string
}

export class ProductVariantRequestDto {
  @IsOptional()
  @IsUUID('4', { message: 'ID nhóm sản phẩm phải là UUID hợp lệ' })
  id: string

  @IsNotEmpty({ message: 'Tên đơn vị không được để trống' })
  @IsString({ message: 'Tên đơn vị phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Tên đơn vị không được vượt quá 50 ký tự' })
  unitName: string

  @IsNotEmpty({ message: 'Tỷ lệ quy đổi không được để trống' })
  @IsNumber({}, { message: 'Tỷ lệ quy đổi phải là số' })
  @Min(1, { message: 'Tỷ lệ quy đổi phải lớn hơn hoặc bằng 1' })
  @IsInt({ message: 'Tỷ lệ quy đổi phải là số nguyên' })
  conversion: number

  @IsOptional()
  @IsString({ message: 'Mã hàng phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã hàng không được vượt quá 50 ký tự' })
  code: string

  @IsOptional()
  @IsString({ message: 'Mã vạch phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã vạch không được vượt quá 50 ký tự' })
  barcode: string

  @IsOptional()
  @IsNumber({}, { message: 'Giá bán phải là số' })
  @Min(0, { message: 'Giá bán không được nhỏ hơn 0' })
  @IsInt({ message: 'Giá bán phải là số nguyên' })
  salePrice: number

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái bán phải là giá trị boolean' })
  isDirectSale: boolean
}

export class CreateProductRequestDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(255, { message: 'Tên sản phẩm không được vượt quá 255 ký tự' })
  name: string

  @IsNotEmpty({ message: 'ID nhóm sản phẩm không được để trống' })
  @IsUUID('4', { message: 'ID nhóm sản phẩm phải là UUID hợp lệ' })
  productGroupId: string

  @IsOptional()
  @IsString({ message: 'Mã sản phẩm phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã sản phẩm không được vượt quá 50 ký tự' })
  code: string

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(ProductTypeEnum, {
    message: `Loại sản phẩm phải là một trong: ${Object.values(ProductTypeEnum).join(', ')}`
  })
  type: ProductTypeEnum

  @IsOptional()
  @IsString({ message: 'Mã vạch phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Mã vạch không được vượt quá 50 ký tự' })
  barcode: string

  @IsOptional()
  @IsString({ message: 'Tên viết tắt phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(100, { message: 'Tên viết tắt không được vượt quá 100 ký tự' })
  shortName: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  description: string

  @IsOptional()
  @IsNumber({}, { message: 'Giá bán phải là số' })
  @Min(0, { message: 'Giá bán không được nhỏ hơn 0' })
  @IsInt({ message: 'Giá bán phải là số nguyên' })
  salePrice: number

  @IsOptional()
  @IsNumber({}, { message: 'Giá vốn phải là số' })
  @Min(0, { message: 'Giá vốn không được nhỏ hơn 0' })
  @IsInt({ message: 'Giá vốn phải là số nguyên' })
  costPrice: number = 0

  @IsOptional()
  @IsString({ message: 'Quy cách đóng gói phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(100, { message: 'Quy cách đóng gói không được vượt quá 100 ký tự' })
  package: string

  @IsOptional()
  @IsString({ message: 'Quốc gia phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(100, { message: 'Quốc gia không được vượt quá 100 ký tự' })
  country: string

  @IsOptional()
  @IsUUID('4', { message: 'ID nhà sản xuất phải là UUID hợp lệ' })
  manufacturerId: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductWeightRequestDto)
  productWeight: ProductWeightRequestDto

  @IsOptional()
  @ValidateNested()
  @Type(() => MedicineInfoRequestDto)
  medicineInfo: MedicineInfoRequestDto

  @IsOptional()
  @IsArray({ message: 'Danh sách sản phẩm cùng loại phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductVariantRequestDto)
  variants: ProductVariantRequestDto[]

  @IsOptional()
  @IsArray({ message: 'Danh sách vị trí kho phải là mảng' })
  @IsUUID('4', { each: true, message: 'Mỗi ID vị trí kho phải là UUID hợp lệ' })
  productLocationIds: string[]

  @IsOptional()
  @IsArray({ message: 'Danh sách ảnh phải là mảng' })
  @IsUUID('4', { each: true, message: 'Mỗi ID ảnh phải là UUID hợp lệ' })
  photoIds: string[]

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái quản lý kho phải là giá trị boolean' })
  isStockEnabled: boolean

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái quản lý kho theo lô là giá trị boolean' })
  isLotEnabled: boolean

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái bán phải là giá trị boolean' })
  isDirectSale: boolean

  @IsOptional()
  @IsNumber({}, { message: 'Số lượng kho phải là số' })
  @Min(0, { message: 'Số lượng kho không được nhỏ hơn 0' })
  stockQuantity: number = 0

  @IsOptional()
  @IsNumber({}, { message: 'Tồn tối thiểu phải là số' })
  @Min(0, { message: 'Tồn tối thiểu không được nhỏ hơn 0' })
  minStock: number

  @IsOptional()
  @IsNumber({}, { message: 'Tồn tối đa phải là số' })
  @Min(0, { message: 'Tồn tối đa không được nhỏ hơn 0' })
  maxStock: number

  @IsOptional()
  @IsString({ message: 'Tên đơn vị phải là chuỗi ký tự' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(50, { message: 'Tên đơn vị không được vượt quá 50 ký tự' })
  unitName: string
}
