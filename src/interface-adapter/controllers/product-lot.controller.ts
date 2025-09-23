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
  CreateProductLotUseCase,
  DeleteManyProductLotUseCase,
  DeleteProductLotUseCase,
  GetAllProductLotUseCase,
  GetOneProductLotUseCase
} from '@usecases/product-lots'
import {
  CreateProductLotRequestDto,
  GetAllProductLotRequestDto,
  GetAllProductLotResponseDto,
  UpdateProductLotRequestDto
} from '@interface-adapter/dtos/product-lots'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { ProductLot } from '@common/types'
import { UpdateProductLotUseCase } from '@usecases/product-lots/update-product-lot.usecase'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'
import { RolesGuard } from '@common/guards'

@Controller('product-lots')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductLotController {
  constructor(
    private readonly _getAllProductLotUseCase: GetAllProductLotUseCase,
    private readonly _getOneProductLotUseCase: GetOneProductLotUseCase,
    private readonly _createProductLotUseCase: CreateProductLotUseCase,
    private readonly _deleteProductLotUseCase: DeleteProductLotUseCase,
    private readonly _deleteManyProductLotUseCase: DeleteManyProductLotUseCase,
    private readonly _updateProductLotUseCase: UpdateProductLotUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.PRODUCT_LOT_CREATE)
  create(
    @Body() data: CreateProductLotRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLot> {
    return this._createProductLotUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.PRODUCT_LOT_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateProductLotRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLot> {
    return this._updateProductLotUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.PRODUCT_LOT_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductLotUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.PRODUCT_LOT_DELETE)
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductLotUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.PRODUCT_LOT_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<ProductLot> {
    return this._getOneProductLotUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.PRODUCT_LOT_VIEW)
  getAll(
    @Query() queryParams: GetAllProductLotRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductLotResponseDto> {
    return this._getAllProductLotUseCase.execute(queryParams, req.branchId)
  }
}
