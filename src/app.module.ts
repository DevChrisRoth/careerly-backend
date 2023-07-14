import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CareerModule } from './career/career.module';
import { LogtailLogger } from './log/LoggerMiddleware';
import { PrismaService } from './prisma_config/prisma.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
@Module({
  imports: [AuthModule, UserModule, CareerModule],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, AuthService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogtailLogger).forRoutes('*');
  }
}
