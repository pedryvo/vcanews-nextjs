# Next.js Rules - VCANews

Best practices specifically for Next.js App Router.

## Component Strategy
* **Server Components (RSC) by Default**: Keep logic on the server to reduce bundle size.
* **Client Components**: Use only when interactivity (hooks, event listeners) is required. Add `"use client"` directive at the top.
* **Composition**: Pass RSCs as children to Client Components to maintain server-side rendering benefits.

## Data Mutations
* **Server Actions**: Preferred for form submissions and data changes.
* **Revalidation**: Explicitly use `revalidatePath` or `revalidateTag` after mutations.
* **Loading States**: Use `loading.tsx` and React `Suspense` for better UX.

## API Routes & Caching
* **Route Handlers**: Use standard HTTP methods. Ensure all handlers are protected.
* **Caching**: Leverage Next.js fetch cache and `unstable_cache` for expensive DB operations.

Broadway
