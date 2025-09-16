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
  CreateMedicineRouteUseCase,
  DeleteMedicineRouteUseCase,
  DeleteManyMedicineRouteUseCase,
  GetAllMedicineRouteUseCase,
  GetOneMedicineRouteUseCase,
  UpdateMedicineRouteUseCase
} from '@usecases/medicine-routes'
import {
  CreateMedicineRouteRequestDto,
  CreateMedicineRouteResponseDto,
  GetAllMedicineRouteRequestDto,
  GetAllMedicineRouteResponseDto,
  UpdateMedicineRouteResponseDto
} from '@interface-adapter/dtos/medicine-routes'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto } from '@common/dtos'
import { MedicineRoute } from '@common/types'

@Controller('medicine-routes')
@UseGuards(AccessTokenGuard)
export class MedicineRouteController {
  constructor(
    private readonly _getAllMedicineRouteUseCase: GetAllMedicineRouteUseCase,
    private readonly _getOneMedicineRouteUseCase: GetOneMedicineRouteUseCase,
    private readonly _createMedicineRouteUseCase: CreateMedicineRouteUseCase,
    private readonly _updateMedicineRouteUseCase: UpdateMedicineRouteUseCase,
    private readonly _deleteMedicineRouteUseCase: DeleteMedicineRouteUseCase,
    private readonly _deleteManyMedicineRouteUseCase: DeleteManyMedicineRouteUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateMedicineRouteRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CreateMedicineRouteResponseDto> {
    return this._createMedicineRouteUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateMedicineRouteRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<UpdateMedicineRouteResponseDto> {
    return this._updateMedicineRouteUseCase.execute(id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteMedicineRouteUseCase.execute(id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyMedicineRouteUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: RequestAccessBranchJWT): Promise<MedicineRoute> {
    return this._getOneMedicineRouteUseCase.execute(id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllMedicineRouteRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllMedicineRouteResponseDto> {
    return this._getAllMedicineRouteUseCase.execute(queryParams, req.branchId)
  }
}
