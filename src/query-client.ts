import { QueryClient, type UseInfiniteQueryResult } from '@tanstack/react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			networkMode: 'online',
			retry: 1,
			retryOnMount: true,
			retryDelay: 1000,
			staleTime: 600_000, //10 min
			refetchOnMount: true,
			refetchOnWindowFocus: false,
			refetchOnReconnect: true
		}
	}
})

/**
 * Centralized query keys factory for type-safe query key management.
 * Each entity has its own namespace with standardized query key patterns.
 *
 * @example
 * ```typescript
 * // Basic definition
 * const makeQueryKeys = {
 *   users: {
 *     all: () => ['users'] as const,
 *     index: (filters?: Record<string, unknown>) => ['users', 'index', filters] as const,
 *     show: (id: string) => ['users', id] as const
 *   }
 * } as const
 *
 * // Basic usage - fetch all users
 * const userQuery = useQuery({
 *   queryKey: queryKeys.users.all(),
 *   queryFn: httpGetUsers
 * })
 *
 * // With filters - fetch filtered users
 * const filteredUsers = useQuery({
 *   queryKey: queryKeys.users.index({ status: 'active', role: 'admin' }),
 *   queryFn: () => httpGetUsers({ status: 'active', role: 'admin' })
 * })
 *
 * // Single user - fetch specific user
 * const user = useQuery({
 *   queryKey: queryKeys.users.show('123'),
 *   queryFn: () => httpGetUser('123')
 * })
 *
 * // Query invalidation - invalidate all user queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
 *
 * // Selective invalidation - invalidate only filtered queries
 * queryClient.invalidateQueries({
 *   queryKey: queryKeys.users.index({ status: 'active' })
 * })
 *
 * // Prefetching
 * queryClient.prefetchQuery({
 *   queryKey: queryKeys.users.show('123'),
 *   queryFn: () => httpGetUser('123')
 * })
 * ```
 */
export const makeQueryKeys = {} as const

export const infiniteQueryFetchNextPage = async (
	infiniteQuery: UseInfiniteQueryResult
) => {
	if (infiniteQuery.hasNextPage && !infiniteQuery.isFetching) {
		await infiniteQuery.fetchNextPage()
	}
}
