import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { queryClient } from './query-client.ts'
import '@/theme.css'
import './translations/i18n.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider } from 'react-router'
import { Toaster } from './components/ui/sonner.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { router } from './router.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			disableTransitionOnChange
			enableColorScheme
			enableSystem
			storageKey='theme'
			themes={['light', 'dark']}
		>
			<ErrorBoundary fallback={<div>Error</div>}>
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>
						<Toaster />
						<RouterProvider router={router} />
					</TooltipProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</ErrorBoundary>
		</ThemeProvider>
	</StrictMode>
)
