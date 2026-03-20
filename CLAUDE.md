# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Monorepo con `backend/` (NestJS) y `frontend/` (framework JS). Cada feature en `backend/src/` sigue arquitectura hexagonal:

```
src/
  <feature>/
    domain/
      entities/        # Modelos de dominio puros
      ports/           # Interfaces (repositorios, servicios externos)
    application/
      services/        # Casos de uso, orquestación
    infrastructure/
      adapters/        # Implementaciones de los ports (e.g. in-memory repo)
      controllers/     # HTTP controllers (NestJS)
    <feature>.module.ts
```

El dominio NO conoce la infraestructura. Las dependencias apuntan hacia adentro (domain ← application ← infrastructure).

## Commands

```bash
# Backend (NestJS)
cd backend && npm install
cd backend && npm run start:dev      # Desarrollo con watch mode
cd backend && npm run build
cd backend && npm run lint           # Auto-fix
cd backend && npm run format
cd backend && npm run test           # Unit tests
cd backend && npm run test:e2e
cd backend && npm run test:cov
cd backend && npx jest src/path/to/file.spec.ts  # Un solo archivo

# Frontend
cd frontend && npm run dev
```

Server backend en puerto 3000 por defecto (configurable via `PORT` env var).

## Architecture — Hexagonal (Ports & Adapters)

- **domain/entities/** — Clases de dominio puras, sin dependencias de frameworks
- **domain/ports/** — Interfaces que el dominio expone (e.g. `ContactRepository`)
- **application/services/** — Casos de uso; orquestan entidades y ports
- **infrastructure/adapters/** — Implementan los ports (e.g. `InMemoryContactRepository`)
- **infrastructure/controllers/** — Controllers NestJS; llaman a application services

Nueva feature: crear módulo `<feature>/<feature>.module.ts` e importarlo en `AppModule`.

## Database

Se usa un **array in-memory como base de datos dummy**. No hay persistencia real ni ORM. El repositorio in-memory implementa el port definido en dominio.

```typescript
// Ejemplo: infrastructure/adapters/in-memory-contact.repository.ts
@Injectable()
export class InMemoryContactRepository implements ContactRepository {
  private readonly contacts: Contact[] = [];
  // ...
}
```

## Coding Rules

- **NO `any`** — TypeScript estricto; tipar todo explícitamente
- **Max 30 líneas por función** — funciones cortas y enfocadas
- **Un export por archivo** — un archivo = una clase/interfaz/función principal
- **SOLID** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **KISS** — la solución más simple que resuelve el problema
- **DRY** — no duplicar lógica; extraer si se repite mas de dos veces

## Key Dependencies

- `class-validator` + `class-transformer` — validación de DTOs con `@Body()` y `ValidationPipe`
- `uuid` — generación de IDs
- `@nestjs/mapped-types` — `PartialType` para update DTOs

## TypeScript Config Notes

- `noImplicitAny` es `false` en tsconfig pero la regla de proyecto es **NO usar `any`**
- `emitDecoratorMetadata` y `experimentalDecorators` habilitados (requeridos por NestJS DI)
- Target: ES2023, module system: NodeNext
