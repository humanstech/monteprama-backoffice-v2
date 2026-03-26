import axios from 'axios'
import { envVars } from '@/env-vars'
import { useAuthStore } from '@/features/auth/stores/store'

const axiosConfig = {
	baseURL: envVars.VITE_API_ENDPOINT,
	headers: {
		common: {
			// Authorization header is set dynamically in request interceptor
			Authorization: false,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		},
		post: {
			'Access-Control-Allow-Origin': '*'
		}
	}
}

// create axios custom instance with custom config
const axiosInstance = axios.create(axiosConfig)

const attemptRefresh = async (refreshToken: string) => {
	try {
		const { data } = await axiosInstance.post('/v1/auth/refresh', {
			token: refreshToken
		})
		useAuthStore.getState().setAuth({
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			user: data.user
		})
		return data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			useAuthStore.getState().reset()
		}
	}
}

// Request interceptor reads token directly from Zustand store
axiosInstance.interceptors.request.use((request) => {
	const { accessToken } = useAuthStore.getState()
	if (accessToken) {
		request.headers.Authorization = `Bearer ${accessToken}`
	}
	return request
})

const endpointsToIgnore = ['/login']

axiosInstance.interceptors.response.use(
	(response) => {
		// pass response without change
		return response
	},
	async (error) => {
		// get error info
		const statusCode = error?.response?.status
		const originalRequest = error.config
		switch (statusCode) {
			case 401: {
				// Get refresh token directly from store
				const { refreshToken } = useAuthStore.getState()
				if (
					refreshToken &&
					!originalRequest._retry &&
					!endpointsToIgnore.includes(error.config.url)
				) {
					originalRequest._retry = true // prevent infinite retry loop
					await attemptRefresh(refreshToken)
					return axiosInstance.request(originalRequest)
				}
				// Reset store - localStorage cleanup is automatic
				useAuthStore.getState().reset()
				return Promise.reject(error)
			}
			default:
				return Promise.reject(error)
		}
	}
)

export default axiosInstance
