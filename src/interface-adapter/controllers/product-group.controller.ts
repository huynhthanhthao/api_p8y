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
  CreateProductGroupResponseDto,
  GetAllProductGroupRequestDto,
  GetAllProductGroupResponseDto,
  UpdateProductGroupResponseDto
} from '@interface-adapter/dtos/product-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { ProductGroup } from '@common/types'

@Controller('product-groups')
@UseGuards(AccessTokenGuard)
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
  create(
    @Body() data: CreateProductGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CreateProductGroupResponseDto> {
    return this._createProductGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: CreateProductGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<UpdateProductGroupResponseDto> {
    return this._updateProductGroupUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductGroupUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<ProductGroup> {
    return this._getOneProductGroupUseCase.execute(params.id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllProductGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductGroupResponseDto> {
    return this._getAllProductGroupUseCase.execute(queryParams, req.branchId)
  }
}
