import { useEffect, useState } from 'react'

const breakpoints = {
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
	lg: '(min-width: 1024px)',
	xl: '(min-width: 1280px)',
	'2xl': '(min-width: 1536px)'
} as const

type Breakpoint = keyof typeof breakpoints

interface UseMediaQueryProps {
	breakpoint: Breakpoint
}

/**
 * Hook that returns a boolean indicating whether the current viewport matches the specified Tailwind CSS breakpoint.
 *
 * @param {UseMediaQueryProps} props - The props object.
 * @param {Breakpoint} props.breakpoint - The breakpoint to match against (e.g., 'sm', 'md', 'lg', 'xl', '2xl').
 * @returns {boolean} `true` if the viewport matches the specified breakpoint, otherwise `false`.
 *
 * @example
 * const isLarge = useMediaQuery({ breakpoint: 'lg' });
 * if (isLarge) {
 *   // Render something for large screens
 * }
 */
export const useMediaQuery = ({ breakpoint }: UseMediaQueryProps) => {
	const query = breakpoints[breakpoint]
	const [matches, setMatches] = useState(
		() => window.matchMedia(query).matches
	)

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query)
		const listener = (event: MediaQueryListEvent) =>
			setMatches(event.matches)

		mediaQueryList.addEventListener('change', listener)
		setMatches(mediaQueryList.matches)

		return () => {
			mediaQueryList.removeEventListener('change', listener)
		}
	}, [query])

	return matches
}
