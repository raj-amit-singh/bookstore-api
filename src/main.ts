import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

	// Handle errors
	app.useGlobalPipes(
		new ValidationPipe({
			skipMissingProperties: false,
			forbidUnknownValues: true,
			transform: true,
			validationError: {
				target: false,
			},
		}),
	);

	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});

	app.setGlobalPrefix('api');
	if (process.env.NODE_ENV !== 'prod') {
		setupSwagger(app);
	}
	await app.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}/api/docs/`);
	});
}
bootstrap();
