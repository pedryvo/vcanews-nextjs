# OAuth Security Rules - VCANews

Specialized rules for NextAuth and OAuth providers.

## Token & Session
* **Client Isolation**: OAuth tokens (Refresh/Access) must never be sent to the browser. Keep them in the `JWT` callback or session if absolutely necessary, but prioritize server-side usage.
* **Safe Callbacks**: Use the `redirect` callback to prevent Open Redirect vulnerabilities.

## Callback Protection
* **Provider Validation**: Ensure the `providerAccountId` matches expectations during the `signIn` callback.
* **Account Linking**: Implement safe strategies for linking multiple OAuth providers to a single email.

## Session Access
* **Lib Utilities**: Always use `@/lib/api-utils.ts` (e.g., `getAdminSession`) for centralized session verification.

Broadway
