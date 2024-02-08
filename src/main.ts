import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('process', process.env);
  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://agentboost-frontend-dev.vercel.app',
      'https://agentboost-api-dev.up.railway.app',
    ],
  });
  await app.listen(process.env.PORT || 5001);
}
bootstrap();
