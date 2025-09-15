import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from '@infrastructure/prisma'
import { ProvinceController } from './controllers/province.controller'
import { AuthController } from './controllers/auth.controller'
import { AppController } from './controllers/app.controller'
import { GetAllProvinceUseCase, GetOneProvinceUseCase } from '@usecases/provinces'
import { CustomerController, CustomerGroupController, FileController } from './controllers'
import {
  SignInUseCase,
  SignUpUseCase,
  AccessBranchUseCase,
  GetMeUseCase,
  RefreshTokenUseCase
} from '@usecases/auth'
import {
  CreateCustomerGroupUseCase,
  DeleteCustomerGroupUseCase,
  DeleteManyCustomerGroupUseCase,
  GetAllCustomerGroupUseCase,
  GetOneCustomerGroupUseCase,
  UpdateCustomerGroupUseCase
} from '@usecases/customer-groups'
import {
  CreateCustomerUseCase,
  DeleteCustomerUseCase,
  DeleteManyCustomerUseCase,
  GetAllCustomerUseCase,
  GetOneCustomerUseCase,
  UpdateCustomerUseCase
} from '@usecases/customers'
import { UploadMultipleFileUseCase } from '@usecases/files'
import {
  CreateSupplierGroupUseCase,
  DeleteSupplierGroupUseCase,
  DeleteManySupplierGroupUseCase,
  GetAllSupplierGroupUseCase,
  GetOneSupplierGroupUseCase,
  UpdateSupplierGroupUseCase
} from '@usecases/supplier-groups'
import { SupplierGroupController } from './controllers/supplier-group.controller'
import { SupplierController } from './controllers/supplier.controller'
import {
  CreateSupplierUseCase,
  DeleteSupplierUseCase,
  DeleteManySupplierUseCase,
  GetAllSupplierUseCase,
  GetOneSupplierUseCase,
  UpdateSupplierUseCase
} from '@usecases/suppliers'

const controllers = [
  AuthController,
  ProvinceController,
  CustomerGroupController,
  CustomerController,
  FileController,
  SupplierGroupController,
  SupplierController
]

const useCases = [
  // Province
  GetAllProvinceUseCase,
  GetOneProvinceUseCase,

  // Auth
  SignInUseCase,
  SignUpUseCase,
  AccessBranchUseCase,
  GetMeUseCase,
  RefreshTokenUseCase,

  // Customer group
  CreateCustomerGroupUseCase,
  DeleteCustomerGroupUseCase,
  DeleteManyCustomerGroupUseCase,
  GetAllCustomerGroupUseCase,
  GetOneCustomerGroupUseCase,
  UpdateCustomerGroupUseCase,

  // Customer
  CreateCustomerUseCase,
  DeleteCustomerUseCase,
  DeleteManyCustomerUseCase,
  GetAllCustomerUseCase,
  GetOneCustomerUseCase,
  UpdateCustomerUseCase,

  // File
  UploadMultipleFileUseCase,

  // SupplierGroup
  CreateSupplierGroupUseCase,
  DeleteSupplierGroupUseCase,
  DeleteManySupplierGroupUseCase,
  GetAllSupplierGroupUseCase,
  GetOneSupplierGroupUseCase,
  UpdateSupplierGroupUseCase,

  // SupplierGroup
  CreateSupplierUseCase,
  DeleteSupplierUseCase,
  DeleteManySupplierUseCase,
  GetAllSupplierUseCase,
  GetOneSupplierUseCase,
  UpdateSupplierUseCase
]

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN }
    })
  ],
  controllers: [AppController, ...controllers],
  providers: [AppService, PrismaService, ...useCases]
})
export class AppModule {}
