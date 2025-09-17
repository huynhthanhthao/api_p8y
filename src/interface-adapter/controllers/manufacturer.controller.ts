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
  CreateManufacturerUseCase,
  DeleteManufacturerUseCase,
  DeleteManyManufacturerUseCase,
  GetAllManufacturerUseCase,
  GetOneManufacturerUseCase,
  UpdateManufacturerUseCase
} from '@usecases/manufacturers'
import {
  CreateManufacturerRequestDto,
  GetAllManufacturerRequestDto,
  GetAllManufacturerResponseDto
} from '@interface-adapter/dtos/manufacturers'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Manufacturer } from '@common/types'

@Controller('manufacturers')
@UseGuards(AccessTokenGuard)
export class ManufacturerController {
  constructor(
    private readonly _getAllManufacturerUseCase: GetAllManufacturerUseCase,
    private readonly _getOneManufacturerUseCase: GetOneManufacturerUseCase,
    private readonly _createManufacturerUseCase: CreateManufacturerUseCase,
    private readonly _updateManufacturerUseCase: UpdateManufacturerUseCase,
    private readonly _deleteManufacturerUseCase: DeleteManufacturerUseCase,
    private readonly _deleteManyManufacturerUseCase: DeleteManyManufacturerUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateManufacturerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Manufacturer> {
    return this._createManufacturerUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: CreateManufacturerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Manufacturer> {
    return this._updateManufacturerUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteManufacturerUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyManufacturerUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Manufacturer> {
    return this._getOneManufacturerUseCase.execute(params.id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllManufacturerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllManufacturerResponseDto> {
    return this._getAllManufacturerUseCase.execute(queryParams, req.branchId)
  }
}
