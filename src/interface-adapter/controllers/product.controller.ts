import { Prisma } from '@prisma/client'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import {
  CreateProductUseCase,
  DeleteManyProductUseCase,
  DeleteProductUseCase,
  GetAllProductUseCase,
  GetOneProductUseCase,
  UpdateProductUseCase
} from '@usecases/products'
import {
  CreateProductRequestDto,
  GetAllProductRequestDto,
  GetAllProductResponseDto
} from '@interface-adapter/dtos/products'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Product } from '@common/types'

@Controller('products')
@UseGuards(AccessTokenGuard)
export class ProductController {
  constructor(
    private readonly _getAllProductUseCase: GetAllProductUseCase,
    private readonly _getOneProductUseCase: GetOneProductUseCase,
    private readonly _createProductUseCase: CreateProductUseCase,
    private readonly _updateProductUseCase: UpdateProductUseCase,
    private readonly _deleteProductUseCase: DeleteProductUseCase,
    private readonly _deleteManyProductUseCase: DeleteManyProductUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateProductRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Product> {
    return this._createProductUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: CreateProductRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Product> {
    return this._updateProductUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Product> {
    return this._getOneProductUseCase.execute(params.id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllProductRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductResponseDto> {
    return this._getAllProductUseCase.execute(queryParams, req.branchId)
  }
}
