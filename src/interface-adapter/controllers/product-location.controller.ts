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
  CreateProductLocationUseCase,
  DeleteProductLocationUseCase,
  DeleteManyProductLocationUseCase,
  GetAllProductLocationUseCase,
  GetOneProductLocationUseCase,
  UpdateProductLocationUseCase
} from '@usecases/product-locations'
import {
  CreateProductLocationRequestDto,
  GetAllProductLocationRequestDto,
  GetAllProductLocationResponseDto,
  UpdateProductLocationRequestDto
} from '@interface-adapter/dtos/product-locations'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { ProductLocation } from '@common/types'
import { RolesGuard } from '@common/guards'
import { Roles } from '@common/utils'
import { PermissionEnum } from '@common/enums'

@Controller('product-locations')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductLocationController {
  constructor(
    private readonly _getAllProductLocationUseCase: GetAllProductLocationUseCase,
    private readonly _getOneProductLocationUseCase: GetOneProductLocationUseCase,
    private readonly _createProductLocationUseCase: CreateProductLocationUseCase,
    private readonly _updateProductLocationUseCase: UpdateProductLocationUseCase,
    private readonly _deleteProductLocationUseCase: DeleteProductLocationUseCase,
    private readonly _deleteManyProductLocationUseCase: DeleteManyProductLocationUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.PRODUCT_LOCATION_CREATE)
  create(
    @Body() data: CreateProductLocationRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLocation> {
    return this._createProductLocationUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.PRODUCT_LOCATION_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateProductLocationRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLocation> {
    return this._updateProductLocationUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.PRODUCT_LOCATION_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductLocationUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.PRODUCT_LOCATION_DELETE)
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductLocationUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.PRODUCT_LOCATION_VIEW)
  getOne(
    @Param() params: UUIDParamDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLocation> {
    return this._getOneProductLocationUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.PRODUCT_LOCATION_VIEW)
  getAll(
    @Query() queryParams: GetAllProductLocationRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductLocationResponseDto> {
    return this._getAllProductLocationUseCase.execute(queryParams, req.branchId)
  }
}
