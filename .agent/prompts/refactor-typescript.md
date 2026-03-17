# Prompt: Refactor TypeScript

**Objective**: Eliminate `any` and enforce strict typing in a specific file.

**Instructions**:
1. Read the target file.
2. Search the repository for relevant Prisma types or existing interfaces.
3. Replace all instances of `any` with:
    * Inferred types.
    * Explicit Prisma types.
    * Custom interfaces for API responses.
4. Ensure all function signatures are fully typed.
5. Run `npx tsc --noEmit` on the file to verify.

Broadway
