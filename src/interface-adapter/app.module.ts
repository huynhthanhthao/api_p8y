import { Role } from './../../node_modules/.prisma/client/index.d'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from '@infrastructure/prisma'
import { GetAllProvinceUseCase, GetOneProvinceUseCase } from '@usecases/provinces'
import {
  AppController,
  AuthController,
  CustomerController,
  CustomerGroupController,
  FileController,
  ManufacturerController,
  PaymentMethodController,
  ProductGroupController,
  ProductLocationController,
  ProductLotController,
  ProvinceController,
  RoleController,
  StockTransactionController,
  SupplierController,
  SupplierGroupController,
  UserController
} from './controllers'
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
import {
  CreateSupplierUseCase,
  DeleteSupplierUseCase,
  DeleteManySupplierUseCase,
  GetAllSupplierUseCase,
  GetOneSupplierUseCase,
  UpdateSupplierUseCase
} from '@usecases/suppliers'
import {
  CreateProductGroupUseCase,
  DeleteProductGroupUseCase,
  DeleteManyProductGroupUseCase,
  GetAllProductGroupUseCase,
  GetOneProductGroupUseCase,
  UpdateProductGroupUseCase
} from '@usecases/product-groups'
import {
  CreateManufacturerUseCase,
  DeleteManufacturerUseCase,
  DeleteManyManufacturerUseCase,
  GetAllManufacturerUseCase,
  GetOneManufacturerUseCase,
  UpdateManufacturerUseCase
} from '@usecases/manufacturers'
import {
  CreateProductLocationUseCase,
  DeleteProductLocationUseCase,
  DeleteManyProductLocationUseCase,
  GetAllProductLocationUseCase,
  GetOneProductLocationUseCase,
  UpdateProductLocationUseCase
} from '@usecases/product-locations'
import { MedicineRouteController } from './controllers/medicine-route.controller'
import {
  CreateMedicineRouteUseCase,
  DeleteMedicineRouteUseCase,
  DeleteManyMedicineRouteUseCase,
  GetAllMedicineRouteUseCase,
  GetOneMedicineRouteUseCase,
  UpdateMedicineRouteUseCase
} from '@usecases/medicine-routes'
import { ProductController } from './controllers/product.controller'
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  DeleteManyProductUseCase,
  GetAllProductUseCase,
  GetOneProductUseCase,
  UpdateProductUseCase
} from '@usecases/products'
import {
  GetAllPaymentMethodUseCase,
  GetOnePaymentMethodUseCase,
  UpsertPaymentMethodUseCase
} from '@usecases/payment-methods'
import { InvoiceController } from './controllers/invoice.controller'
import {
  CreateInvoiceUseCase,
  CancelInvoiceUseCase,
  CancelManyInvoiceUseCase,
  GetAllInvoiceUseCase,
  GetOneInvoiceUseCase
} from '@usecases/invoices'
import {
  CreateProductLotUseCase,
  DeleteProductLotUseCase,
  DeleteManyProductLotUseCase,
  GetAllProductLotUseCase,
  GetOneProductLotUseCase
} from '@usecases/product-lots'
import {
  CreateStockTransactionUseCase,
  CancelStockTransactionUseCase,
  CancelManyStockTransactionUseCase,
  GetAllStockTransactionUseCase,
  GetOneStockTransactionUseCase,
  ReviewStockTransactionUseCase,
  UpdateStockTransactionUseCase
} from '@usecases/stock-transactions'
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  DeleteManyUserUseCase,
  GetAllUserUseCase,
  GetOneUserUseCase,
  UpdateUserUseCase
} from '@usecases/users'
import {
  CreateRoleUseCase,
  DeleteRoleUseCase,
  DeleteManyRoleUseCase,
  GetAllRoleUseCase,
  GetOneRoleUseCase,
  UpdateRoleUseCase
} from '@usecases/roles'

const controllers = [
  AuthController,
  ProvinceController,
  CustomerGroupController,
  CustomerController,
  FileController,
  SupplierGroupController,
  SupplierController,
  ProductGroupController,
  ManufacturerController,
  ProductLocationController,
  MedicineRouteController,
  ProductController,
  PaymentMethodController,
  InvoiceController,
  ProductLotController,
  StockTransactionController,
  UserController,
  RoleController
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
  UpdateSupplierUseCase,

  // SupplierGroup
  CreateProductGroupUseCase,
  DeleteProductGroupUseCase,
  DeleteManyProductGroupUseCase,
  GetAllProductGroupUseCase,
  GetOneProductGroupUseCase,
  UpdateProductGroupUseCase,

  // Manufacturer
  CreateManufacturerUseCase,
  DeleteManufacturerUseCase,
  DeleteManyManufacturerUseCase,
  GetAllManufacturerUseCase,
  GetOneManufacturerUseCase,
  UpdateManufacturerUseCase,

  // ProductLocation
  CreateProductLocationUseCase,
  DeleteProductLocationUseCase,
  DeleteManyProductLocationUseCase,
  GetAllProductLocationUseCase,
  GetOneProductLocationUseCase,
  UpdateProductLocationUseCase,

  // MedicineRoute
  CreateMedicineRouteUseCase,
  DeleteMedicineRouteUseCase,
  DeleteManyMedicineRouteUseCase,
  GetAllMedicineRouteUseCase,
  GetOneMedicineRouteUseCase,
  UpdateMedicineRouteUseCase,

  // Product
  CreateProductUseCase,
  DeleteProductUseCase,
  DeleteManyProductUseCase,
  GetAllProductUseCase,
  GetOneProductUseCase,
  UpdateProductUseCase,

  // PaymentMethod
  GetAllPaymentMethodUseCase,
  GetOnePaymentMethodUseCase,
  UpsertPaymentMethodUseCase,

  // Invoice
  CreateInvoiceUseCase,
  CancelInvoiceUseCase,
  CancelManyInvoiceUseCase,
  GetAllInvoiceUseCase,
  GetOneInvoiceUseCase,

  // ProductLot
  CreateProductLotUseCase,
  DeleteProductLotUseCase,
  DeleteManyProductLotUseCase,
  GetAllProductLotUseCase,
  GetOneProductLotUseCase,

  // StockTransaction
  CreateStockTransactionUseCase,
  CancelStockTransactionUseCase,
  CancelManyStockTransactionUseCase,
  GetAllStockTransactionUseCase,
  GetOneStockTransactionUseCase,
  ReviewStockTransactionUseCase,
  UpdateStockTransactionUseCase,

  // User
  CreateUserUseCase,
  DeleteUserUseCase,
  DeleteManyUserUseCase,
  GetAllUserUseCase,
  GetOneUserUseCase,
  UpdateUserUseCase,

  // Role
  CreateRoleUseCase,
  DeleteRoleUseCase,
  DeleteManyRoleUseCase,
  GetAllRoleUseCase,
  GetOneRoleUseCase,
  UpdateRoleUseCase
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
