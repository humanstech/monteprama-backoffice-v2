import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/features/auth/stores/store'

function PrivateRoute() {
	const { accessToken } = useAuthStore()
	const { pathname, search, hash } = useLocation()

	if (!accessToken) {
		return (
			<Navigate
				replace
				to={{
					pathname: '/login',
					search: `redirect=${pathname}${search}`,
					hash
				}}
			/>
		)
	}
	return <Outlet />
}

export { PrivateRoute }
