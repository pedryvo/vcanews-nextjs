# Performance Rules - VCANews

Optimize for speed and user experience.

## Rendering
* **Memoization**: Use `useMemo` and `useCallback` strategically in high-frequency interactive components.
* **Heavy Lists**: Implement virtualization for lists with hundreds of items.

## Database & Network
* **TanStack Query**: Use for all client-side data fetching to leverage caching and background updates.
* **Pre-fetching**: Pre-fetch data for expected user routes to eliminate navigation delay.

## Asset Optimization
* **Images**: Use `next/image` with proper `priority` for LCP images.
* **Bundle Size**: Avoid importing entire libraries (e.g., Loadash); use treeshake-friendly alternatives.

Broadway
