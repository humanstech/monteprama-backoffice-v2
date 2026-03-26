import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { raise } from '@/helpers/utils'
import { useStatues, useSummaries } from '../hooks'

function StatueEditPage() {
	const { statueId } = useParams()
	const navigate = useNavigate()
	const id = statueId ?? raise('Missing statueId')
	const { data: statues, isLoading: loadingStatues } = useStatues()
	const { data: summary, isLoading: loadingSummary } = useSummaries()

	if (loadingStatues || loadingSummary) {
		return <Skeleton className='h-[600px]' />
	}

	const statue = statues?.find((s) => s.id === id)
	if (!statue) {
		return <p>Statua non trovata</p>
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-4'>
				<Button
					onClick={() => navigate('/statues')}
					size='icon'
					variant='ghost'
				>
					<ArrowLeft className='size-5' />
				</Button>
				<h1 className='font-bold text-2xl'>
					{statue.name ?? 'Statua'}
				</h1>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div className='space-y-4'>
					<h2 className='font-semibold text-lg'>Cover</h2>
					{statue.cover?.url ? (
						<img
							alt={statue.name ?? ''}
							className='max-h-[300px] rounded-lg object-cover'
							height={300}
							src={statue.cover.url}
							width={400}
						/>
					) : (
						<div className='flex h-[200px] items-center justify-center rounded-lg bg-muted'>
							<span className='text-muted-foreground'>
								Nessuna cover
							</span>
						</div>
					)}
				</div>

				<div className='space-y-4'>
					<h2 className='font-semibold text-lg'>Galleria</h2>
					<div className='grid grid-cols-3 gap-2'>
						{statue.medias.map((media) => (
							<img
								alt={media.filename ?? ''}
								className='h-24 w-full rounded-md object-cover'
								height={96}
								key={media.id}
								src={media.url ?? ''}
								width={96}
							/>
						))}
					</div>
				</div>
			</div>

			<div className='flex gap-4'>
				<Button onClick={() => navigate(`/statues/${id}/content`)}>
					Modifica contenuti statua
				</Button>
			</div>

			{summary && (
				<div className='space-y-4'>
					<h2 className='font-semibold text-lg'>
						Riepilogo generale
					</h2>
					<p className='text-muted-foreground text-sm'>
						{summary.name ?? 'Riepilogo'} - {summary.allIds.length}{' '}
						contenuti
					</p>
					<Button
						onClick={() => navigate('/statues/summary')}
						variant='outline'
					>
						Modifica riepilogo
					</Button>
				</div>
			)}
		</div>
	)
}

export default StatueEditPage
