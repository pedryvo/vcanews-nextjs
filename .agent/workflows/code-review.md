---
description: Perform a deep code review of a file or directory.
---

# Workflow: Code Review

Analyze the selected code against the workspace rules and best practices.

## Execution Steps

1. **Verify Strict Typing**:
    * Identify any usage of `any` or `as any`.
    * Check if function parameters and return types are explicitly defined.

2. **Architectural Consistency**:
    * Ensure the code belongs to the correct layer (UI, Service, Repository).
    * Verify that database calls are exclusively in repositories.

3. **Security Check**:
    * Check for Zod validation on external inputs.
    * Verify authentication/authorization checks.

4. **Performance Check**:
    * Look for inefficient Prisma queries (missing selects, missing pagination).
    * Identify unnecessary React re-renders.

## Expected Output
A report detailing:
* **Violations**: Rules that were broken.
* **Critical Issues**: Security or performance bugs.
* **Actionable Recommendations**: Specific code changes to improve quality.

Broadway
