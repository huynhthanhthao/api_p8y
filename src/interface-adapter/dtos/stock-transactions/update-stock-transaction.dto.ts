import { PartialType } from '@nestjs/swagger'
import { CreateStockTransactionRequestDto } from './create-stock-transactions.dto'

export class UpdateStockTransactionRequestDto extends PartialType(
  CreateStockTransactionRequestDto
) {}
