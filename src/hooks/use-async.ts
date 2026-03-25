import { useCallback, useState } from 'react'

function useAsync() {
	const [status, setStatus] = useState<
		'idle' | 'success' | 'error' | 'loading'
	>('idle')

	const run = useCallback(<T>(promise: Promise<T>) => {
		setStatus('loading')
		return promise.then(
			(newData) => {
				setStatus('success')
				return newData
			},
			(newError: Error) => {
				setStatus('error')
				return Promise.reject(newError)
			}
		)
	}, [])

	return {
		isIdle: status === 'idle',
		isLoading: status === 'loading',
		isError: status === 'error',
		isSuccess: status === 'success',
		status,
		run
	}
}

export { useAsync }
