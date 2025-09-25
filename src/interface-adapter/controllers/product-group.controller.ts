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
  CreateProductGroupUseCase,
  DeleteManyProductGroupUseCase,
  DeleteProductGroupUseCase,
  GetAllProductGroupUseCase,
  GetOneProductGroupUseCase,
  UpdateProductGroupUseCase
} from '@usecases/product-groups'
import {
  CreateProductGroupRequestDto,
  GetAllProductGroupRequestDto,
  GetAllProductGroupResponseDto,
  UpdateProductGroupRequestDto
} from '@interface-adapter/dtos/product-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { ProductGroup } from '@common/types'
import { RolesGuard } from '@common/guards'
import { Roles } from '@common/utils'
import { PermissionEnum } from '@common/enums'

@Controller('product-groups')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductGroupController {
  constructor(
    private readonly _getAllProductGroupUseCase: GetAllProductGroupUseCase,
    private readonly _getOneProductGroupUseCase: GetOneProductGroupUseCase,
    private readonly _createProductGroupUseCase: CreateProductGroupUseCase,
    private readonly _updateProductGroupUseCase: UpdateProductGroupUseCase,
    private readonly _deleteProductGroupUseCase: DeleteProductGroupUseCase,
    private readonly _deleteManyProductGroupUseCase: DeleteManyProductGroupUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.PRODUCT_GROUP_CREATE)
  create(
    @Body() data: CreateProductGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductGroup> {
    return this._createProductGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.PRODUCT_GROUP_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateProductGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductGroup> {
    return this._updateProductGroupUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.PRODUCT_GROUP_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductGroupUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.PRODUCT_GROUP_DELETE)
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.PRODUCT_GROUP_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<ProductGroup> {
    return this._getOneProductGroupUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.PRODUCT_GROUP_VIEW)
  getAll(
    @Query() queryParams: GetAllProductGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductGroupResponseDto> {
    return this._getAllProductGroupUseCase.execute(queryParams, req.branchId)
  }
}
