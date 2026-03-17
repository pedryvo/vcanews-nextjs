---
description: Enterprise Architecture Standards, Security Guidelines, and Development Conventions for the VCANews repository.
---

# Workspace Rules – Enterprise Architecture Standards

These rules define the architecture, security standards, and development conventions for this repository.

All generated or modified code must follow these rules.

---

# 1. Core Technology Stack

The application stack is fixed and must not be changed without justification.

Framework:

* Next.js (App Router)

Language:

* TypeScript (strict mode)

Database:

* PostgreSQL

ORM:

* Prisma

Authentication:

* OAuth providers (Google)

Deployment:

* Vercel

---

# 2. TypeScript Strict Mode

Type safety is mandatory.

Rules:

* Never use `any`
* Never use `as any`
* Prefer `unknown` when the type cannot be inferred
* Always type function parameters
* Always type API responses
* Always type React props
* Avoid unsafe casts

Prefer:

* interfaces
* type aliases
* generics
* inferred Prisma types

Required tsconfig options:

strict = true
noImplicitAny = true
strictNullChecks = true
noUncheckedIndexedAccess = true
exactOptionalPropertyTypes = true

---

# 3. Clean Architecture Principles

The project follows a layered architecture.

Each layer has a clear responsibility.

Layers:

1. Presentation Layer
2. Application Layer
3. Domain Layer
4. Infrastructure Layer

Dependencies must only flow inward.

Example dependency direction:

UI → Services → Repositories → Database

Never reverse this direction.

---

# 4. Folder Structure

The repository must follow this structure:

/app
Next.js routes and API handlers

/components
Pure UI components

/hooks
Reusable React hooks

/services
Application business logic

/repositories
Database access layer

/lib
Utilities and helpers

/types
Shared TypeScript types

/config
Environment configuration

/validators
Zod schemas

---

# 5. Responsibilities per Layer

UI Layer:

* React components
* Presentation logic only
* No database access
* No business rules

Service Layer:

* Business logic
* Application workflows
* Calls repositories

Repository Layer:

* Prisma queries
* Database logic only

Utilities Layer:

* shared helpers
* formatting
* small reusable logic

---

# 6. Database Access Rules

All database access must go through repositories.

Forbidden:

* Prisma queries inside components
* Prisma queries inside UI hooks
* Prisma queries inside API routes

Correct flow:

API Route → Service → Repository → Prisma

---

# 7. Prisma Best Practices

When writing Prisma queries:

* Select only required fields
* Avoid large nested includes
* Always paginate large datasets
* Prefer indexed columns for filters

Prefer:

select queries

Avoid:

loading entire records unnecessarily

Use Prisma generated types whenever possible.

---

# 8. API Design

All APIs must follow these rules.

Input validation is mandatory.

Validation must use Zod schemas.

Example flow:

Request → Zod Validation → Service → Repository → Response

All responses must be typed.

---

# 9. Authentication and Authorization

Authentication must be enforced on protected routes.

Rules:

* Never trust client authentication state
* Always validate session on the server
* Sensitive routes must verify user identity
* Avoid exposing user identifiers unnecessarily

OAuth configuration must:

* validate callback URLs
* avoid open redirects
* avoid exposing tokens

---

# 10. Security Practices

Follow secure coding practices.

Rules:

* Never expose secrets in frontend code
* Never expose environment variables starting with SECRET
* Never log sensitive tokens
* Validate all user input
* Avoid injection vulnerabilities
* Protect API endpoints against abuse

Sensitive data must never be sent to the client.

---

# 11. Input Validation

All external input must be validated.

Sources of external input:

* API requests
* query parameters
* form submissions
* OAuth callbacks

Validation must use:

Zod schemas.

---

# 12. Performance Guidelines

Code must consider runtime performance.

Avoid:

* unnecessary re-renders
* large database queries
* loading large objects

Prefer:

* pagination
* selective queries
* caching when appropriate

---

# 13. React Component Guidelines

Components must follow these rules.

Components must:

* be small
* have a single responsibility
* use typed props

Avoid:

* business logic in components
* database access
* complex state logic

Move reusable logic into custom hooks.

---

# 14. Error Handling

All asynchronous code must handle errors.

Rules:

* use try/catch when necessary
* do not expose internal errors to clients
* return safe error messages

Example response:

{
"error": "Invalid request"
}

Never leak stack traces.

---

# 15. Logging

Logging must follow these rules.

Allowed:

* error logging
* operational logging

Forbidden:

* logging secrets
* logging tokens
* logging personal data

---

# 16. Code Quality Standards

All code must be:

* readable
* maintainable
* modular
* strongly typed

Avoid:

* large files
* deep nesting
* duplicated logic

Prefer:

* reusable modules
* small functions
* clear naming

---

# 17. Dependency Management

Avoid adding new libraries unnecessarily.

Before introducing a new dependency:

* check if functionality already exists
* verify maintenance status
* verify bundle size impact

---

# 18. Testing Readiness

Code should be easily testable.

Rules:

* isolate business logic
* avoid tight coupling
* allow mocking dependencies

Services should be testable independently of UI.

---

# 19. AI Code Generation Rules

When generating new code:

* follow the existing architecture
* reuse existing patterns
* never introduce `any`
* prioritize type safety
* prefer maintainability over cleverness

Before adding new code:

* search the repository for existing functionality

---

# 20. Refactoring Guidelines

When refactoring code:

* maintain behavior compatibility
* improve readability
* improve type safety
* reduce duplication

Refactoring should not introduce breaking changes without explicit instruction.