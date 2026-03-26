import { useNavigate } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useStatues } from '../hooks'

function StatuesListPage() {
	const navigate = useNavigate()
	const { data: statues, isLoading } = useStatues()

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<h1 className='font-bold text-2xl'>Statue</h1>
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
			<h1 className='font-bold text-2xl'>Statue</h1>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{statues?.map((statue) => (
					<button
						className='group overflow-hidden rounded-xl border bg-card text-left transition-shadow hover:shadow-md'
						key={statue.id}
						onClick={() => navigate(`/statues/${statue.id}/edit`)}
						type='button'
					>
						{statue.cover?.url ? (
							<img
								alt={statue.name ?? ''}
								className='h-[140px] w-full object-cover'
								height={140}
								loading='lazy'
								src={statue.cover.url}
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
								{statue.name ?? 'Senza nome'}
							</h2>
							{statue.version != null && (
								<p className='mt-1 text-muted-foreground text-sm'>
									v{statue.version}
								</p>
							)}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

export default StatuesListPage
