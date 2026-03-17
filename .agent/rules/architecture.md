# Architecture Rules - VCANews

The project follows Clean Architecture principles with a layered approach to ensure separation of concerns and maintainability.

## Core Principles
* **Separation of Concerns**: Each layer has a unique responsibility.
* **Inward Dependency Flow**: Dependencies must only flow toward the center (Domain/Service).
* **Direction**: UI → Services → Repositories → Database.

## Layers & Responsibilities

### 1. Presentation Layer (`/app`, `/components`)
* **Responsibility**: React components and view logic.
* **Restriction**: No direct database access or business logic.
* **Pattern**: Use custom hooks to encapsulate complex UI state.

### 2. Service Layer (`/services`, `/actions`)
* **Responsibility**: Orchestrates application workflows and business logic.
* **Restriction**: Does not know about specific DB implementations; calls repository methods.
* **Pattern**: Server Actions for mutations; services for shared logic.

### 3. Repository Layer (`/repositories`)
* **Responsibility**: All data access logic using Prisma.
* **Restriction**: Only layer allowed to import `prisma` from `@/lib/db`.
* **Pattern**: Return typed results or DTOs to services.

### 4. Domain & Utility Layer (`/types`, `/lib`, `/validators`)
* **Responsibility**: Shared types, Zod schemas, and stateless helpers.

## Folder Structure Conventions
* `/app`: Route handlers and API routes.
* `/components**: Pure UI components.
* `/repositories`: Data access layer.
* `/services`: Business orchestration.
* `/validators`: Zod schemas for input validation.
* `/lib`: Cross-cutting concerns (Auth, DB config).

Broadway
