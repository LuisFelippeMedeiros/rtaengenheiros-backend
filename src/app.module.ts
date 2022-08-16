import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { RoleModule } from './role/role.module';
import { GroupModule } from './group/group.module';
import { CompanyModule } from './company/company.module';
import { RolesgroupModule } from './rolesgroup/rolesgroup.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StateModule,
    CityModule,
    RoleModule,
    GroupModule,
    CompanyModule,
    RolesgroupModule,
    SupplierModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
