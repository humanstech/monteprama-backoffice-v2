import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { raise } from '@/helpers/utils'
import { useSite } from '../hooks'
import type { SitePoi } from '../types'

function SiteDetailPage() {
	const { siteId } = useParams()
	const navigate = useNavigate()
	const { data: site, isLoading } = useSite(siteId ?? raise('Missing siteId'))

	if (isLoading) {
		return <Skeleton className='h-[600px]' />
	}

	if (!site) {
		return <p>Sito non trovato</p>
	}

	const sortedPois = [...(site.pointsOfInterest ?? [])].sort(
		(a, b) => (a.step ?? 0) - (b.step ?? 0)
	)

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-4'>
				<Button
					onClick={() => navigate('/sites')}
					size='icon'
					variant='ghost'
				>
					<ArrowLeft className='size-5' />
				</Button>
				<h1 className='font-bold text-2xl'>{site.name ?? 'Sito'}</h1>
			</div>

			<Tabs defaultValue='general'>
				<TabsList>
					<TabsTrigger value='general'>Generale</TabsTrigger>
					<TabsTrigger value='poi'>Punti di interesse</TabsTrigger>
					<TabsTrigger value='tickets'>Biglietti</TabsTrigger>
					<TabsTrigger value='info'>Info</TabsTrigger>
				</TabsList>

				<TabsContent className='mt-6' value='general'>
					<GeneralSection site={site} />
				</TabsContent>

				<TabsContent className='mt-6' value='poi'>
					<PoiListSection pois={sortedPois} siteId={siteId ?? ''} />
				</TabsContent>

				<TabsContent className='mt-6' value='tickets'>
					{/* Will be implemented in Task 12 */}
					<p className='text-muted-foreground'>
						Sezione biglietti - in arrivo
					</p>
				</TabsContent>

				<TabsContent className='mt-6' value='info'>
					{/* Will be implemented in Task 13 */}
					<p className='text-muted-foreground'>
						Sezione info - in arrivo
					</p>
				</TabsContent>
			</Tabs>
		</div>
	)
}

function GeneralSection({
	site
}: {
	site: NonNullable<ReturnType<typeof useSite>['data']>
}) {
	return (
		<div className='space-y-6'>
			<div className='grid gap-6 lg:grid-cols-2'>
				<div className='space-y-4'>
					<h2 className='font-semibold text-lg'>Cover</h2>
					{site.cover?.url ? (
						<img
							alt={site.name ?? ''}
							className='max-h-[300px] w-auto rounded-lg object-cover'
							height={300}
							loading='lazy'
							src={site.cover.url}
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
						{site.medias?.map((media) => (
							<img
								alt={media.filename ?? ''}
								className='h-24 w-full rounded-md object-cover'
								height={96}
								key={media.id}
								loading='lazy'
								src={media.url ?? ''}
								width={96}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

function PoiListSection({ pois, siteId }: { pois: SitePoi[]; siteId: string }) {
	const navigate = useNavigate()

	return (
		<div className='space-y-4'>
			<h2 className='font-semibold text-lg'>
				Punti di interesse ({pois.length})
			</h2>
			<div className='space-y-2'>
				{pois.map((poi) => (
					<button
						className='flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent'
						key={poi.id}
						onClick={() =>
							navigate(`/sites/${siteId}/poi/${poi.id}`)
						}
						type='button'
					>
						<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm'>
							{poi.step ?? '?'}
						</span>
						{poi.cover?.url && (
							<img
								alt=''
								className='size-12 rounded-md object-cover'
								height={48}
								loading='lazy'
								src={poi.cover.url}
								width={48}
							/>
						)}
						<div className='flex-1'>
							<p className='font-medium'>
								{poi.title ??
									poi.description ??
									'POI senza nome'}
							</p>
							{poi.language && (
								<p className='text-muted-foreground text-sm'>
									{poi.language}
								</p>
							)}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

export default SiteDetailPage
