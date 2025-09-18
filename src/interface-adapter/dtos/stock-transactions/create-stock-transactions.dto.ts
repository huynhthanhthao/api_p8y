import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEmail,
  IsUUID,
  Matches
} from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class CreateStockTransactionRequestDto {}
