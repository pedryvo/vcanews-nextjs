# TypeScript Strict Rules - VCANews

Strict type safety is the foundation of this repository's reliability.

## Mandatory Configuration
The following `tsconfig` flags must be enabled:
* `strict: true`
* `noImplicitAny: true`
* `strictNullChecks: true`
* `noUncheckedIndexedAccess: true`
* `exactOptionalPropertyTypes: true`

## Typing Guidelines
* **No `any`**: The use of `any` and `as any` is strictly forbidden.
* **Preference for `unknown`**: Use `unknown` for data from external sources until validated.
* **Typed API Responses**: Every API route and Server Action must have explicit return types.
* **React Props**: Always use `interface` or `type` for component props; avoid inline prop types.
* **Module Augmentation**: Use `.d.ts` files to extend library types (e.g., NextAuth).

## Patterns
* **Prisma Inference**: Leverage generated Prisma types (`Prisma.UserGetPayload`, etc.) for database entities.
* **Generics**: Use generics for reusable components and hooks to maintain type integrity.
* **Zod Integration**: Use `z.infer` to create TypeScript types from validation schemas.

Broadway
