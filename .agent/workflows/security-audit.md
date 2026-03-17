---
description: Perform a security audit of the repository.
---

# Workflow: Security Audit

Scan the repository for potential security vulnerabilities.

## Execution Steps

1. **Input Validation Audit**:
    * Search for API routes and Server Actions.
    * Verify if every input is guarded by a Zod schema.

2. **Access Control Audit**:
    * Check if sensitive admin routes verify the `ADMIN` role.
    * Verify that `getServerSession` is used on protected pages.

3. **Secret Leak Audit**:
    * Scan for hardcoded strings that look like keys or credentials.
    * Verify `.env` structure.

4. **OAuth Flow Audit**:
    * Review `lib/auth.ts` for safe callback handling.

## Expected Output
A `security_audit.md` report with:
* **Vulnerability List**: Ranked by severity.
* **Fix Strategy**: Steps to remediate each finding.

Broadway
