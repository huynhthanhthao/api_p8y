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
  GetAllProductResponseDto,
  UpdateProductRequestDto
} from '@interface-adapter/dtos/products'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Product } from '@common/types'
import { RolesGuard } from '@common/guards'
import { Roles } from '@common/utils'
import { PermissionEnum } from '@common/enums'

@Controller('products')
@UseGuards(AccessTokenGuard, RolesGuard)
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
  @Roles(PermissionEnum.PRODUCT_CREATE)
  create(
    @Body() data: CreateProductRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Product> {
    return this._createProductUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.PRODUCT_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateProductRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Product> {
    return this._updateProductUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.PRODUCT_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.PRODUCT_DELETE)
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.PRODUCT_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Product> {
    return this._getOneProductUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.PRODUCT_VIEW)
  getAll(
    @Query() queryParams: GetAllProductRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductResponseDto> {
    return this._getAllProductUseCase.execute(queryParams, req.branchId)
  }
}
