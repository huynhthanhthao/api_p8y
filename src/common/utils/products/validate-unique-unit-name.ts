import { HttpException } from '@common/exceptions'
import { CreateProductRequestDto } from '@interface-adapter/dtos/products'
import { HttpStatus } from '@nestjs/common'

export function validateUniqueNames(data: CreateProductRequestDto): void {}
