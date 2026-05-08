import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Servir archivos estáticos de la carpeta uploads
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Habilitar CORS para el frontend en React
  app.enableCors({
  origin: [
    'https://fascinating-taiyaki-debea6.netlify.app',
    'http://localhost:3000', 'http://localhost:3001',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global de API
  app.setGlobalPrefix('api');

  try {
    const { UserService } = require('./user/user.service');
    const userService = app.get(UserService);
    await userService.create({
      email: 'logistica@icocert.pe',
      password: 'TuClaveSegura123',
      firstName: 'Martin',
      lastName: 'Canales',
      role: 'ADMIN' 
    });
    console.log('✅ Usuario Admin creado correctamente');
  } catch (error) {
    console.log('⚠️ El usuario ya existe o falta configuración');
  }
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend corriendo en http://localhost:${port}/api`);
}
bootstrap();
