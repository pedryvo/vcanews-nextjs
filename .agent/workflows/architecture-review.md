---
description: Review the repository architecture and layer separation.
---

# Workflow: Architecture Review

Evaluate the project's adherence to Clean Architecture and Repository patterns.

## Execution Steps

1. **Dependency Mapping**:
    * Trace calls from UI -> Service -> Repository.
    * Identify any "Layer Leaking" (e.g., Prisma in components).

2. **Module Boundaries**:
    * Ensure directories like `/repositories` are clean of business logic.
    * Verify that `/services` or Actions orchestrate multiple repo calls properly.

3. **File Size Audit**:
    * Identify "God Files" (> 300 lines) and suggest splitting.

## Expected Output
An `architecture_review.md` update with a visual diagram (Mermaid) of current vs ideal state.

Broadway
