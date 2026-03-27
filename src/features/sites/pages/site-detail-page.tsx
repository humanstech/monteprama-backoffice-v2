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
import { GripVertical, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoSitesSection } from '@/features/info-sites/components/info-sites-section'
import type { Media } from '@/features/media/types'
import { TicketsSection } from '@/features/tickets/components/tickets-section'
import { raise } from '@/helpers/utils'
import {
	useDeleteSiteCover,
	useRemoveSiteMedia,
	useReorderPois,
	useSite,
	useUploadSiteCover,
	useUploadSiteGallery
} from '../hooks'
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
					<GeneralSection site={site} siteId={siteId ?? ''} />
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

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

function DropZone({
	onFiles,
	isPending,
	multiple,
	label
}: {
	onFiles: (files: File[]) => void
	isPending: boolean
	multiple?: boolean
	label: string
}) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [isDragOver, setIsDragOver] = useState(false)

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragOver(false)
			const files = [...e.dataTransfer.files].filter((f) =>
				f.type.startsWith('image/')
			)
			if (files.length > 0) {
				onFiles(multiple ? files : [files[0]])
			}
		},
		[onFiles, multiple]
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? [...e.target.files] : []
		if (files.length > 0) {
			onFiles(files)
		}
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	return (
		<button
			className={`flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
				isDragOver
					? 'border-primary bg-primary/5'
					: 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
			}`}
			disabled={isPending}
			onClick={() => inputRef.current?.click()}
			onDragLeave={() => setIsDragOver(false)}
			onDragOver={(e) => {
				e.preventDefault()
				setIsDragOver(true)
			}}
			onDrop={handleDrop}
			type='button'
		>
			{isPending ? (
				<Loader2 className='size-8 animate-spin text-muted-foreground' />
			) : (
				<Upload className='size-8 text-muted-foreground' />
			)}
			<span className='text-muted-foreground text-sm'>
				{isPending ? 'Caricamento...' : label}
			</span>
			<input
				accept={IMAGE_ACCEPT}
				className='hidden'
				multiple={multiple}
				onChange={handleChange}
				ref={inputRef}
				type='file'
			/>
		</button>
	)
}

function ImagePreview({
	src,
	alt,
	onDelete,
	onReplace,
	isDeleting
}: {
	src: string
	alt: string
	onDelete?: () => void
	onReplace?: (file: File) => void
	isDeleting?: boolean
}) {
	const replaceInputRef = useRef<HTMLInputElement>(null)

	return (
		<div className='group relative overflow-hidden rounded-lg'>
			<img
				alt={alt}
				className='h-full w-full object-cover'
				height={300}
				loading='lazy'
				src={src}
				width={300}
			/>
			<div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100'>
				{onReplace && (
					<>
						<Button
							onClick={() => replaceInputRef.current?.click()}
							size='icon'
							variant='secondary'
						>
							<ImagePlus className='size-4' />
						</Button>
						<input
							accept={IMAGE_ACCEPT}
							className='hidden'
							onChange={(e) => {
								const file = e.target.files?.[0]
								if (file) {
									onReplace(file)
								}
							}}
							ref={replaceInputRef}
							type='file'
						/>
					</>
				)}
				{onDelete && (
					<Button
						disabled={isDeleting}
						onClick={onDelete}
						size='icon'
						variant='destructive'
					>
						{isDeleting ? (
							<Loader2 className='size-4 animate-spin' />
						) : (
							<Trash2 className='size-4' />
						)}
					</Button>
				)}
			</div>
		</div>
	)
}

function GeneralSection({
	site,
	siteId
}: {
	site: NonNullable<ReturnType<typeof useSite>['data']>
	siteId: string
}) {
	const uploadCover = useUploadSiteCover(siteId)
	const deleteCover = useDeleteSiteCover(siteId)
	const uploadGallery = useUploadSiteGallery(siteId)
	const removeMedia = useRemoveSiteMedia(siteId)
	const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null)

	const existingMediaIds = (site.medias ?? [])
		.map((m) => m.id)
		.filter((id): id is string => id != null)

	const handleUploadCover = (files: File[]) => {
		uploadCover.mutate(files, {
			onSuccess: () => toast.success('Cover aggiornata'),
			onError: () => toast.error('Errore nel caricamento della cover')
		})
	}

	const handleDeleteCover = () => {
		deleteCover.mutate(undefined, {
			onSuccess: () => toast.success('Cover rimossa'),
			onError: () => toast.error('Errore nella rimozione della cover')
		})
	}

	const handleReplaceCover = (file: File) => {
		uploadCover.mutate([file], {
			onSuccess: () => toast.success('Cover sostituita'),
			onError: () => toast.error('Errore nella sostituzione della cover')
		})
	}

	const handleUploadGallery = (files: File[]) => {
		uploadGallery.mutate(
			{ files, existingMediaIds },
			{
				onSuccess: () =>
					toast.success(
						`${files.length} ${files.length === 1 ? 'immagine aggiunta' : 'immagini aggiunte'}`
					),
				onError: () =>
					toast.error('Errore nel caricamento delle immagini')
			}
		)
	}

	const handleRemoveMedia = () => {
		if (!mediaToDelete) {
			return
		}
		removeMedia.mutate(
			{
				mediaIdToRemove: mediaToDelete.id,
				currentMediaIds: existingMediaIds
			},
			{
				onSuccess: () => {
					toast.success('Immagine rimossa dalla galleria')
					setMediaToDelete(null)
				},
				onError: () =>
					toast.error("Errore nella rimozione dell'immagine")
			}
		)
	}

	return (
		<div className='space-y-8'>
			{/* Cover */}
			<div className='space-y-4'>
				<h2 className='font-semibold text-lg'>Cover</h2>
				{site.cover?.url ? (
					<div className='max-w-md'>
						<ImagePreview
							alt={site.name ?? 'Cover'}
							isDeleting={deleteCover.isPending}
							onDelete={handleDeleteCover}
							onReplace={handleReplaceCover}
							src={site.cover.url}
						/>
					</div>
				) : (
					<div className='max-w-md'>
						<DropZone
							isPending={uploadCover.isPending}
							label='Trascina o clicca per caricare la cover'
							onFiles={handleUploadCover}
						/>
					</div>
				)}
			</div>

			{/* Gallery */}
			<div className='space-y-4'>
				<h2 className='font-semibold text-lg'>
					Galleria ({site.medias?.length ?? 0})
				</h2>
				<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
					{site.medias?.map((media) => (
						<div className='aspect-square' key={media.id}>
							<ImagePreview
								alt={media.filename ?? ''}
								onDelete={() => setMediaToDelete(media)}
								src={media.url ?? ''}
							/>
						</div>
					))}
					<div className='aspect-square'>
						<DropZone
							isPending={uploadGallery.isPending}
							label='Aggiungi immagini'
							multiple
							onFiles={handleUploadGallery}
						/>
					</div>
				</div>
			</div>

			{/* Delete media confirmation */}
			<AlertDialog
				onOpenChange={(open) => {
					if (!open) {
						setMediaToDelete(null)
					}
				}}
				open={mediaToDelete != null}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Rimuovi immagine</AlertDialogTitle>
						<AlertDialogDescription>
							Sei sicuro di voler rimuovere questa immagine dalla
							galleria?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annulla</AlertDialogCancel>
						<AlertDialogAction
							disabled={removeMedia.isPending}
							onClick={handleRemoveMedia}
						>
							{removeMedia.isPending && (
								<Loader2 className='mr-2 size-4 animate-spin' />
							)}
							Rimuovi
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
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
