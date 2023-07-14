import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, PrismaService],
})
export class UserModule {}
