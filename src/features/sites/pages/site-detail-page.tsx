import type { DragEndEvent } from '@dnd-kit/core'
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoSitesSection } from '@/features/info-sites/components/info-sites-section'
import { TicketsSection } from '@/features/tickets/components/tickets-section'
import { raise } from '@/helpers/utils'
import { useReorderPois, useSite } from '../hooks'
import type { SitePoi } from '../types'

function SiteDetailPage() {
	const { siteId } = useParams()
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
			<h1 className='font-bold text-2xl'>{site.name ?? 'Sito'}</h1>

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
					<TicketsSection siteId={siteId ?? ''} />
				</TabsContent>

				<TabsContent className='mt-6' value='info'>
					<InfoSitesSection siteId={siteId ?? ''} />
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

function SortablePoiItem({ poi, siteId }: { poi: SitePoi; siteId: string }) {
	const navigate = useNavigate()
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: poi.id ?? '' })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	}

	return (
		<div
			className='flex items-center gap-0 rounded-lg border bg-card transition-shadow hover:shadow-sm'
			ref={setNodeRef}
			style={style}
		>
			<button
				className='flex shrink-0 cursor-grab items-center justify-center rounded-l-lg px-2 py-4 text-muted-foreground hover:text-foreground active:cursor-grabbing'
				type='button'
				{...attributes}
				{...listeners}
			>
				<GripVertical className='size-5' />
			</button>
			<button
				className='flex flex-1 items-center gap-4 p-4 pl-0 text-left transition-colors hover:bg-accent/50'
				onClick={() => navigate(`/sites/${siteId}/poi/${poi.id}`)}
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
						{poi.title ?? poi.description ?? 'POI senza nome'}
					</p>
					{poi.language && (
						<p className='text-muted-foreground text-sm'>
							{poi.language}
						</p>
					)}
				</div>
			</button>
		</div>
	)
}

function PoiListSection({ pois, siteId }: { pois: SitePoi[]; siteId: string }) {
	const reorder = useReorderPois(siteId)
	const [localPois, setLocalPois] = useState<SitePoi[] | null>(null)

	const displayPois = localPois ?? pois
	const poiIds = displayPois.map((p) => p.id ?? '')

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) {
			return
		}

		const oldIndex = displayPois.findIndex((p) => p.id === active.id)
		const newIndex = displayPois.findIndex((p) => p.id === over.id)
		if (oldIndex === -1 || newIndex === -1) {
			return
		}

		const reordered = [...displayPois]
		const [moved] = reordered.splice(oldIndex, 1)
		reordered.splice(newIndex, 0, moved)

		const withSteps = reordered.map((poi, i) => ({
			...poi,
			step: i + 1
		}))

		setLocalPois(withSteps)

		const updates = withSteps
			.filter(
				(p): p is SitePoi & { id: string; step: number } =>
					p.id != null && p.step != null
			)
			.map((p) => ({ siteId, id: p.id, step: p.step }))

		reorder.mutate(updates, {
			onSuccess: () => {
				setLocalPois(null)
				toast.success('Ordine aggiornato')
			},
			onError: () => {
				setLocalPois(null)
				toast.error("Errore nell'aggiornamento dell'ordine")
			}
		})
	}

	return (
		<div className='space-y-4'>
			<h2 className='font-semibold text-lg'>
				Punti di interesse ({displayPois.length})
			</h2>
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<SortableContext
					items={poiIds}
					strategy={verticalListSortingStrategy}
				>
					<div className='space-y-2'>
						{displayPois.map((poi) => (
							<SortablePoiItem
								key={poi.id}
								poi={poi}
								siteId={siteId}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default SiteDetailPage
