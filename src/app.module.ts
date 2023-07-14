import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma_config/prisma.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CareerModule } from './career/career.module';

@Module({
  imports: [AuthModule, UserModule, CareerModule],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, AuthService, UserService],
})
export class AppModule {}
