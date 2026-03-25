import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	type RouteProps
} from 'react-router'
import { PrivateRoute } from './route-guards/private-route'
import { PublicRoute } from './route-guards/public-route'

export const routes = {
	home: {
		index: true,
		element: <h1>Home</h1>,
		handle: {
			fullPath: '/'
		}
	},
	login: {
		path: 'login',
		element: <h1>Login</h1>,
		handle: {
			fullPath: '/login'
		}
	},
	notFound: {
		path: '*',
		element: <h1>Not Found</h1>
	}
} as const satisfies Record<string, RouteProps>

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/'>
			<Route element={<PublicRoute />}>
				<Route {...routes.login} />
			</Route>
			<Route element={<PrivateRoute />}>
				<Route {...routes.home} />
			</Route>
			<Route {...routes.notFound} />
		</Route>
	)
)
