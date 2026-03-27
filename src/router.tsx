import { lazy, Suspense } from 'react'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route
} from 'react-router'
import { AppLayout } from './components/layout/app-layout'
import { Spinner } from './components/ui/spinner'
import { PrivateRoute } from './route-guards/private-route'
import { PublicRoute } from './route-guards/public-route'

const LoginPage = lazy(() => import('@/features/auth/pages/login-page'))
const SitesListPage = lazy(
	() => import('@/features/sites/pages/sites-list-page')
)
const SiteDetailPage = lazy(
	() => import('@/features/sites/pages/site-detail-page')
)
const PoiDetailPage = lazy(() => import('@/features/poi/pages/poi-detail-page'))
const StatuesListPage = lazy(
	() => import('@/features/statues/pages/statues-list-page')
)
const StatueEditPage = lazy(
	() => import('@/features/statues/pages/statue-edit-page')
)
const StatueContentPage = lazy(
	() => import('@/features/statues/pages/statue-content-page')
)
const SummaryEditPage = lazy(
	() => import('@/features/statues/pages/summary-edit-page')
)
const UsersPage = lazy(() => import('@/features/users/pages/users-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))

function LazyPage({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className='flex h-full items-center justify-center'>
					<Spinner />
				</div>
			}
		>
			{children}
		</Suspense>
	)
}

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/'>
			<Route element={<PublicRoute />}>
				<Route
					element={
						<LazyPage>
							<LoginPage />
						</LazyPage>
					}
					path='login'
				/>
			</Route>
			<Route element={<PrivateRoute />}>
				<Route element={<AppLayout />}>
					<Route
						element={
							<LazyPage>
								<SitesListPage />
							</LazyPage>
						}
						index
					/>
					<Route
						element={
							<LazyPage>
								<SitesListPage />
							</LazyPage>
						}
						path='sites'
					/>
					<Route
						element={
							<LazyPage>
								<SiteDetailPage />
							</LazyPage>
						}
						path='sites/:siteId'
					/>
					<Route
						element={
							<LazyPage>
								<PoiDetailPage />
							</LazyPage>
						}
						path='sites/:siteId/poi/:poiId'
					/>
					<Route
						element={
							<LazyPage>
								<StatuesListPage />
							</LazyPage>
						}
						path='statues'
					/>
					<Route
						element={
							<LazyPage>
								<StatueEditPage />
							</LazyPage>
						}
						path='statues/:statueId/edit'
					/>
					<Route
						element={
							<LazyPage>
								<StatueContentPage />
							</LazyPage>
						}
						path='statues/:statueId/content'
					/>
					<Route
						element={
							<LazyPage>
								<SummaryEditPage />
							</LazyPage>
						}
						path='statues/summary'
					/>
					<Route
						element={
							<LazyPage>
								<UsersPage />
							</LazyPage>
						}
						path='users'
					/>
					<Route
						element={
							<LazyPage>
								<NotFoundPage />
							</LazyPage>
						}
						path='*'
					/>
				</Route>
			</Route>
			<Route
				element={
					<LazyPage>
						<NotFoundPage />
					</LazyPage>
				}
				path='*'
			/>
		</Route>
	)
)
