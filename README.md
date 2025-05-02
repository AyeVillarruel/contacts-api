# 📇 Contacts API - Backend con NestJS, Prisma y MySQL

Este proyecto es una API RESTful construida con **NestJS**, **Prisma** y **MySQL**, que permite gestionar contactos personales con funcionalidades avanzadas y orientadas a buenas prácticas de arquitectura backend.

---

## 🚀 Tecnologías utilizadas

- [NestJS](https://nestjs.com/) – Framework para construir APIs escalables en Node.js
- [Prisma ORM](https://www.prisma.io/) – ORM moderno para trabajar con MySQL
- [MySQL](https://www.mysql.com/) – Base de datos relacional
- [Docker](https://www.docker.com/) – Contenedor de base de datos
- [AWS S3](https://aws.amazon.com/s3/) – Almacenamiento de imágenes de perfil
- [JWT](https://jwt.io/) – Autenticación basada en tokens
- [Swagger](https://swagger.io/) – Documentación interactiva

---

## 📂 Estructura del proyecto

```
src/
├── auth/
├── contacts/
│   ├── controller/
│   ├── service/
│   ├── dto/
│   └── repository/
├── notifications/
├── users/
├── common/
│   ├── filters/
│   └── decorators/
├── prisma/
└── main.ts

---

## ⚙️ Requisitos previos

- Node.js 18+
- Docker + Docker Compose
- Cuenta en AWS S3 (con bucket configurado)

---

## 🛠️ Instalación y configuración

1. **Clonar el proyecto:**
```bash
git clone https://github.com/AyeVillaruel/contacts-api.git
cd contacts-api
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Crear `.env` basado en `.env.example`**
```env
PORT=3001
DATABASE_URL="mysql://root:rootpass@localhost:3307/contactsdb"
JWT_SECRET="tu_secret"
AWS_BUCKET_NAME=contacts-app-images
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

4. **Levantar base de datos con Docker:**
```bash
docker-compose up -d
```

5. **Sincronizar base de datos y generar Prisma Client:**
```bash
npx prisma db push
npx prisma generate
```

6. **Correr el seed para generar usuarios, contactos y logs:**
```bash
npx ts-node prisma/seed.ts
```

7. **Iniciar la aplicación en modo desarrollo:**
```bash
npm run start:dev
```

---

## 📌 Funcionalidades implementadas

### 🔐 Autenticación JWT
- Login con email y contraseña (usuarios seed: demo@example.com / 123456)
- Protección de rutas con guards y decorators personalizados

### 📇 Gestión de contactos
- Crear, listar, actualizar y eliminar (soft delete)
- Restauración de contactos eliminados
- Marcar como favorito o no favorito

### ☁️ Subida de avatar
- Subida de imágenes a AWS S3
- Vinculación del avatar con el contacto correspondiente

### 📝 Logs de acciones
- Cada acción de actualización registra un log de cambio (qué cambió, antes y después)
- Relación con el usuario que realizó el cambio

### 🔔 Notificaciones
- Por cumpleaños (cronjob diario que verifica y notifica)
- Por eventos: restaurar, marcar favorito (implementado de forma extensible)
- Lectura, marcado como leído, soft delete de notificaciones

### 🕒 Tareas programadas (Scheduler)
- Cronjob que corre todos los días y notifica cumpleaños

### 🧾 Swagger (Documentación)
- Documentación y prueba de todos los endpoints en [http://localhost:3001/api](http://localhost:3001/api)

---

## 🧪 Tests en progreso

Actualmente el proyecto cuenta con algunos tests e2e implementados, por ejemplo para:

- Crear contactos
- Validar que devuelva errores con datos inválidos

Los tests están escritos con **Jest + Supertest** y se encuentran en la carpeta `/test`.

Se planea seguir ampliándolos para cubrir:

- Autenticación y login
- Notificaciones (lectura, creación, marcado como leída)
- Logs de contacto
- Restauración y eliminación soft

---

## 📌 Qué falta implementar

- Validaciones de roles o permisos (admin vs usuario común)
- Middleware global de logging y performance
- Tests unitarios y de integración con Jest
- Endpoint para crear notificaciones personalizadas desde UI
- Validaciones más estrictas (por ejemplo, para fechas de nacimiento futuras)

---

## 💡 Ideas a futuro

- 🌍 Websockets para notificaciones en tiempo real
- 🧠 Inteligencia de contacto duplicado
- 🧾 Exportación de contactos a CSV / vCard
- 📆 Sincronización con Google Calendar
- 📨 Envío de mails por cumpleaños
- 🔒 Roles y permisos avanzados (ACL)
- 🔍 Buscador global con filtros dinámicos


