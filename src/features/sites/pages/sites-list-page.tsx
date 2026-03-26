import { useNavigate } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useSites } from '../hooks'

function SitesListPage() {
	const navigate = useNavigate()
	const { data: sites, isLoading } = useSites()

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<h1 className='font-bold text-2xl'>Siti archeologici</h1>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton
							className='h-[200px] rounded-xl'
							key={`skeleton-${i.toString()}`}
						/>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<h1 className='font-bold text-2xl'>Siti archeologici</h1>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{sites?.map((site) => (
					<button
						className='group overflow-hidden rounded-xl border bg-card text-left transition-shadow hover:shadow-md'
						key={site.id}
						onClick={() => navigate(`/sites/${site.id}`)}
						type='button'
					>
						{site.cover?.url ? (
							<img
								alt={site.name ?? ''}
								className='h-[140px] w-full object-cover'
								height={140}
								loading='lazy'
								src={site.cover.url}
								width={400}
							/>
						) : (
							<div className='flex h-[140px] items-center justify-center bg-muted'>
								<span className='text-muted-foreground'>
									Nessuna immagine
								</span>
							</div>
						)}
						<div className='p-4'>
							<h2 className='font-semibold group-hover:underline'>
								{site.name ?? 'Senza nome'}
							</h2>
							{site.pointsOfInterest && (
								<p className='mt-1 text-muted-foreground text-sm'>
									{site.pointsOfInterest.length} punti di
									interesse
								</p>
							)}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

export default SitesListPage
