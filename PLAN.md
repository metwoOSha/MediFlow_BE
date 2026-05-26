# MediFlow — Backend

## Stack
- Node.js, Express, TypeScript
- PostgreSQL (pg)
- JWT, bcrypt, zod

## Structure
src/
  routes/
  controllers/
  middleware/
  db/
  types/
  app.ts
  server.ts

## Database
Tables: users, specializations, doctors, schedules, appointments

## API

### Auth (public)
- POST /auth/register
- POST /auth/login

### Doctors (public)
- GET /doctors
- GET /doctors/:id
- GET /doctors/:id/slots?date=

### Appointments (auth required)
- POST /appointments
- GET /appointments/my
- PATCH /appointments/:id/cancel

### Admin (admin role required)
- POST /admin/doctors
- POST /admin/doctors/:id/schedule
- PATCH /admin/appointments/:id/status
- DELETE /admin/doctors/:id

## Middleware
- loggerMiddleware
- authMiddleware — JWT check
- adminMiddleware — role check
- errorMiddleware — global error handler
- validateMiddleware — zod validation

## Auth
JWT access token