# Prisma Query Optimization Rules - VCANews

Ensure database performance at scale.

## Indexing & Filtering
* **Indexed Filters**: Always filter by indexed columns (e.g., `id`, `email`, `@unique` fields).
* **Avoid Full Table Scans**: Verify that complex filters are performant.

## Mapping & DTOs
* **Frontend DTOs**: Map database entities to specialized DTOs (Data Transfer Objects) before returning to the frontend to avoid leaking internal structure.
* **Select Usage**: Use `select` to exclude sensitive fields (like hashed passwords) at the DB level.

## Handling Joins
* **Flat Queries**: Prefer multiple targeted queries over deeply nested `include` blocks if data size is significant.
* **Batching**: Use `prisma.$transaction` for atomic multiple operations.

Broadway
