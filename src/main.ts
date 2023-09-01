import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { PrismaService } from './prisma_config/prisma.service';

require('dotenv').config();
declare const module: any;
const mysqlStore = require('express-mysql-session')(session);
const options = {
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  createDatabaseTable: true,
};
const sessionStore = new mysqlStore(options);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 30,
      message: {
        status: 'Du hast zu viele Anfragen, bitte warte einen Moment.',
      },
      standardHeaders: true,
      skipFailedRequests: true,
      legacyHeaders: true,
    }),
  ); // allows 5 requests per minute
  const sessionMiddleware = session({
    secret: process.env.CAREERLY_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'careerlySessionId',
    cookie: {
      signed: true,
      httpOnly: false,
      encode: (val) => val,
      sameSite: 'none',
      secure: 'auto',
    },
    store: sessionStore,
  });
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: ['http://localhost:8080', 'https://matchly.me'],
    credentials: true,
  });
  app.use(compression({ level: 7, strategy: 1 }));
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  process.env.NODE_ENV === 'production' ? app.setGlobalPrefix('api') : null;
  await app.listen(process.env.PORT || 3000);
  Logger.log(
    `Backend Application listening at ${await app.getUrl()} on port ${
      process.env.PORT || 3000
    }`,
  );
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
