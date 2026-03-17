---
description: Audit the application for performance bottlenecks.
---

# Workflow: Performance Audit

Identify areas where responsiveness or load times can be improved.

## Execution Steps

1. **Query Analysis**:
    * Identify large `findMany` calls without pagination.
    * Check for `include` blocks that can be replaced with `select`.

2. **RSC vs Client Component Audit**:
    * Search for oversized Client Components that could be split into Server Components.

3. **Bundle Impact**:
    * Identify heavy libraries and suggest lighter alternatives.

## Expected Output
A report with:
* **Latency Risks**: Slow DB or API patterns.
* **Optimization Map**: List of files and specific changes for better performance.

Broadway
