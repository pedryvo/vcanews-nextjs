# Security Rules - VCANews

Protect user data and maintain application integrity.

## Input & Validation
* **Zod Everywhere**: All external input (API bodies, query params, FormData) must be validated via Zod schemas.
* **Sanitization**: Ensure string inputs are sanitized before being used in dangerous contexts.

## Authentication & Authorization
* **Server-Side Validation**: Never rely on client-side state for authorization.
* **Session Integrity**: Use `getServerSession` with `authOptions` on every protected route.
* **Role-Based Access**: Verify `user.role` for admin-only operations.

## Secret Management
* **No Secrets in Frontend**: Sensitive environment variables must NOT be prefixed with `NEXT_PUBLIC_`.
* **Audit**: Regularly check for hardcoded secrets in code.

## Error Handling & Logging
* **Safe Errors**: Do not leak stack traces or internal DB errors to the client. Return generic "Internal Server Error" for unknown failures.
* **Secure Logging**: Never log PII, tokens, or passwords.

Broadway
