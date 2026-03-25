import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/features/auth/stores/store'
import { routes } from '@/router'

function PrivateRoute() {
	const { accessToken } = useAuthStore()
	const { pathname, search, hash } = useLocation()

	if (!accessToken) {
		return (
			<Navigate
				replace
				to={{
					pathname: routes.login.handle.fullPath,
					search: `redirect=${pathname}${search}`,
					hash
				}}
			/>
		)
	}
	return <Outlet />
}

export { PrivateRoute }
