import { Navigate, Outlet } from 'react-router'
import { z } from 'zod'
import { useAuthStore } from '@/features/auth/stores/store'
import { useParsedSearchParams } from '@/hooks/use-parsed-search-params'
import { routes } from '@/router'

function PublicRoute() {
	const { accessToken } = useAuthStore()
	const { searchParams } = useParsedSearchParams(
		z.object({ redirect: z.string().optional() })
	)

	if (accessToken) {
		return (
			<Navigate
				replace
				to={searchParams.redirect ?? routes.home.handle.fullPath}
			/>
		)
	}
	return <Outlet />
}

export { PublicRoute }
