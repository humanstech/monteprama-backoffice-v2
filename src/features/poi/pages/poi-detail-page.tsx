import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { JobBadge } from '@/components/job-badge'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { LANGUAGES, type LanguageLabel } from '@/constants/languages'
import { useSite } from '@/features/sites/hooks'
import type { SitePoi } from '@/features/sites/types'
import { raise } from '@/helpers/utils'
import {
	useApprovePoiContent,
	useCloneToTemporary,
	usePoiContents,
	useUpdatePoiContent,
	useUpdatePoiCoordinates
} from '../hooks'
import { usePoiStore } from '../stores/poi-store'
import type { FlowStep, PoiContent } from '../types'

const FLOW_STEPS: { key: FlowStep; label: string; number: number }[] = [
	{ key: 'textAndMedia', label: 'Testi e media', number: 1 },
	{ key: 'generatedTexts', label: 'Testi alternativi', number: 2 },
	{ key: 'translations', label: 'Traduzioni', number: 3 },
	{ key: 'audio', label: 'Audioguide', number: 4 }
]

function StepIndicator({
	step,
	isActive,
	onClick
}: {
	step: (typeof FLOW_STEPS)[number]
	isActive: boolean
	onClick: () => void
}) {
	return (
		<button
			className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
				isActive
					? 'border-primary bg-primary/10 text-primary shadow-sm'
					: 'border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground'
			}`}
			onClick={onClick}
			type='button'
		>
			<span
				className={`flex h-7 w-7 items-center justify-center rounded-md font-medium text-sm text-white ${
					isActive ? 'bg-primary' : 'bg-muted-foreground/50'
				}`}
			>
				{step.number}
			</span>
			<span className='font-medium text-sm'>{step.label}</span>
		</button>
	)
}

function StepSeparator() {
	return <div className='h-px w-10 bg-border' />
}

function StepTextAndMedia({
	contents,
	onSave,
	poi,
	siteId,
	isBozza
}: {
	contents: PoiContent[]
	onSave: (id: string, text: string) => void
	poi?: SitePoi
	siteId: string
	isBozza: boolean
}) {
	// The "standard" content (non-summary) is the main text
	const standardContent = contents.find(
		(c) => c.type === 'standard' && c.isSummary === false
	)
	const [description, setDescription] = useState(
		standardContent?.content ?? ''
	)
	const [lat, setLat] = useState(String(poi?.posY ?? ''))
	const [lng, setLng] = useState(String(poi?.posX ?? ''))
	const updateCoords = useUpdatePoiCoordinates(siteId)

	const handleSaveCoordinates = () => {
		if (!poi?.id) {
			return
		}
		const latNum = Number.parseFloat(lat)
		const lngNum = Number.parseFloat(lng)
		if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
			toast.error('Latitudine e longitudine devono essere numeri validi')
			return
		}
		updateCoords.mutate(
			{ poiId: poi.id, lat: latNum, lng: lngNum },
			{ onSuccess: () => toast.success('Coordinate aggiornate') }
		)
	}

	return (
		<div className='space-y-6'>
			{/* Cover + Testo generale */}
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-[2fr_5fr]'>
				{/* Cover */}
				<div className='space-y-2 rounded-lg border p-4'>
					<h3 className='font-semibold'>Cover</h3>
					<p className='text-muted-foreground text-xs'>
						Immagine visualizzata come anteprima del sito
					</p>
					{poi?.cover?.url ? (
						<img
							alt='Cover'
							className='h-[200px] w-full rounded-md object-cover'
							height={200}
							loading='lazy'
							src={poi.cover.url}
							width={300}
						/>
					) : (
						<div className='flex h-[200px] items-center justify-center rounded-md border border-dashed bg-muted/50'>
							<span className='text-muted-foreground text-sm'>
								Nessuna immagine
							</span>
						</div>
					)}
				</div>

				{/* Testo generale */}
				<div className='space-y-2 rounded-lg border p-4'>
					<div className='flex items-center justify-between'>
						<h3 className='font-semibold'>Testo generale</h3>
						{standardContent && (
							<div className='flex items-center gap-2 text-xs'>
								<JobBadge
									label='Generazione'
									status={standardContent.jobGenerationStatus}
								/>
							</div>
						)}
					</div>
					<Textarea
						onChange={(e) => setDescription(e.target.value)}
						readOnly={!isBozza}
						rows={8}
						value={description}
					/>
					{isBozza && standardContent?.id && (
						<Button
							disabled={description === standardContent.content}
							onClick={() =>
								onSave(
									standardContent.id as string,
									description
								)
							}
							size='sm'
						>
							Salva testo
						</Button>
					)}
				</div>
			</div>

			{/* Latitudine e Longitudine */}
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
				<div className='space-y-2'>
					<Label htmlFor='latitude'>Latitudine</Label>
					<Input
						id='latitude'
						onChange={(e) => setLat(e.target.value)}
						placeholder='es. 39.9333'
						type='text'
						value={lat}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='longitude'>Longitudine</Label>
					<Input
						id='longitude'
						onChange={(e) => setLng(e.target.value)}
						placeholder='es. 8.4667'
						type='text'
						value={lng}
					/>
				</div>
			</div>
			{(lat !== String(poi?.posY ?? '') ||
				lng !== String(poi?.posX ?? '')) && (
				<Button
					disabled={updateCoords.isPending}
					onClick={handleSaveCoordinates}
					size='sm'
					variant='outline'
				>
					Salva coordinate
				</Button>
			)}
		</div>
	)
}

function findContent(contents: PoiContent[], type: string, isSummary: boolean) {
	return contents.find((c) => c.type === type && c.isSummary === isSummary)
}

const CONTENT_TYPES = [
	{
		label: 'Testo sintetico',
		type: 'standard',
		isSummary: true
	},
	{
		label: 'Testo bambino',
		type: 'kid',
		isSummary: false
	},
	{
		label: 'Testo bambino sintetico',
		type: 'kid',
		isSummary: true
	}
] as const

const ALL_CONTENT_TYPES = [
	{
		label: 'Testo standard',
		type: 'standard',
		isSummary: false
	},
	...CONTENT_TYPES
] as const

function EditableContentBlock({
	content,
	label,
	isBozza,
	onSave,
	checked,
	onCheckedChange
}: {
	content: PoiContent | undefined
	label: string
	isBozza: boolean
	onSave: (id: string, text: string) => void
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}) {
	const [text, setText] = useState(content?.content ?? '')
	const originalText = content?.content ?? ''

	const isJobRunning =
		content?.jobGenerationStatus === 'in_progress' ||
		content?.jobGenerationStatus === 'processing'

	if (!content) {
		return null
	}

	return (
		<div className='space-y-3 rounded-lg border p-4'>
			<div className='flex items-center justify-between'>
				<p className='font-semibold text-sm'>{label}</p>
				<div className='flex items-center gap-2 text-xs'>
					<JobBadge
						label='Generazione'
						status={content.jobGenerationStatus}
					/>
				</div>
			</div>

			{isJobRunning ? (
				<div className='flex items-center gap-2 py-4 text-muted-foreground'>
					<Loader2 className='h-4 w-4 animate-spin' />
					<span className='text-sm'>Elaborazione in corso...</span>
				</div>
			) : (
				<Textarea
					onChange={(e) => setText(e.target.value)}
					readOnly={!isBozza}
					rows={6}
					value={text}
				/>
			)}

			{isBozza && content.id != null && (
				<div className='flex items-center gap-2'>
					<Button
						disabled={text === originalText}
						onClick={() => onSave(content.id as string, text)}
						size='sm'
					>
						Salva
					</Button>
					<Button
						disabled={text === originalText}
						onClick={() => setText(originalText)}
						size='sm'
						variant='ghost'
					>
						Annulla
					</Button>
				</div>
			)}

			{isBozza && content.id != null && (
				<div className='flex items-center gap-2 border-t pt-3'>
					<Checkbox
						checked={checked}
						id={`check-${content.id}`}
						onCheckedChange={(v) => onCheckedChange(v as boolean)}
					/>
					<Label
						className='font-normal text-sm'
						htmlFor={`check-${content.id}`}
					>
						Seleziona per la traduzione
					</Label>
				</div>
			)}
		</div>
	)
}

function StepGeneratedTexts({
	contents,
	isBozza,
	onSave
}: {
	contents: PoiContent[]
	isBozza: boolean
	onSave: (id: string, text: string) => void
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

	const toggleId = (id: string, checked: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			if (checked) {
				next.add(id)
			} else {
				next.delete(id)
			}
			return next
		})
	}

	const standardContent = findContent(contents, 'standard', false)

	if (contents.length === 0) {
		return (
			<p className='text-muted-foreground'>
				Nessun contenuto per questa lingua.
			</p>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Descrizione principale - read only */}
			<div className='space-y-2 rounded-lg border p-4'>
				<h3 className='font-semibold'>Descrizione principale</h3>
				{standardContent && (
					<div className='flex items-center gap-2 text-xs'>
						<JobBadge
							label='Generazione'
							status={standardContent.jobGenerationStatus}
						/>
					</div>
				)}
				<Textarea
					readOnly
					rows={4}
					value={standardContent?.content ?? ''}
				/>
			</div>

			{/* 3 editable content blocks in a grid */}
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
				{CONTENT_TYPES.map((ct) => {
					const content = findContent(contents, ct.type, ct.isSummary)
					return (
						<EditableContentBlock
							checked={selectedIds.has(content?.id ?? '')}
							content={content}
							isBozza={isBozza}
							key={ct.label}
							label={ct.label}
							onCheckedChange={(checked) =>
								toggleId(content?.id ?? '', checked)
							}
							onSave={onSave}
						/>
					)
				})}
			</div>
		</div>
	)
}

function TranslationRow({
	label,
	italianContent,
	translatedContent,
	isBozza,
	onSave,
	checked,
	onCheckedChange
}: {
	label: string
	italianContent: string
	translatedContent: PoiContent | undefined
	isBozza: boolean
	onSave: (id: string, text: string) => void
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}) {
	const [text, setText] = useState(translatedContent?.content ?? '')
	const originalText = translatedContent?.content ?? ''

	const isJobRunning =
		translatedContent?.jobTranslationStatus === 'in_progress' ||
		translatedContent?.jobTranslationStatus === 'processing'

	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
			{/* Italian original - read only */}
			<div className='space-y-2 rounded-lg border p-4'>
				<p className='font-semibold text-sm'>{label}</p>
				<Textarea readOnly rows={6} value={italianContent} />
			</div>

			{/* Translated - editable */}
			<div className='space-y-2 rounded-lg border p-4'>
				<div className='flex items-center justify-between'>
					<p className='font-semibold text-sm'>{label}</p>
					<div className='flex items-center gap-2 text-xs'>
						{isJobRunning && (
							<Loader2 className='h-3 w-3 animate-spin' />
						)}
						<JobBadge
							label='Traduzione'
							status={translatedContent?.jobTranslationStatus}
						/>
					</div>
				</div>

				{isJobRunning ? (
					<div className='flex items-center gap-2 py-4 text-muted-foreground'>
						<Loader2 className='h-4 w-4 animate-spin' />
						<span className='text-sm'>Traduzione in corso...</span>
					</div>
				) : (
					<Textarea
						onChange={(e) => setText(e.target.value)}
						readOnly={!isBozza}
						rows={6}
						value={text}
					/>
				)}

				{isBozza && translatedContent?.id != null && (
					<Button
						disabled={text === originalText}
						onClick={() =>
							onSave(translatedContent.id as string, text)
						}
						size='sm'
					>
						Salva
					</Button>
				)}

				{isBozza && translatedContent?.id != null && (
					<div className='flex items-center gap-2 border-t pt-3'>
						<Checkbox
							checked={checked}
							id={`tts-check-${translatedContent.id}`}
							onCheckedChange={(v) =>
								onCheckedChange(v as boolean)
							}
						/>
						<Label
							className='font-normal text-sm'
							htmlFor={`tts-check-${translatedContent.id}`}
						>
							Pronto per le audioguide
						</Label>
					</div>
				)}
			</div>
		</div>
	)
}

function StepTranslations({
	contents,
	isBozza,
	onSave,
	italianContents,
	allIds
}: {
	contents: PoiContent[]
	isBozza: boolean
	onSave: (id: string, text: string) => void
	italianContents: PoiContent[]
	allIds: string[]
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

	const toggleId = (id: string, checked: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			if (checked) {
				next.add(id)
			} else {
				next.delete(id)
			}
			return next
		})
	}

	const contentIds = contents
		.map((c) => c.id)
		.filter((id): id is string => id != null)

	const selectAllForLanguage = (checked: boolean) => {
		if (checked) {
			setSelectedIds((prev) => {
				const next = new Set(prev)
				for (const id of contentIds) {
					next.add(id)
				}
				return next
			})
		} else {
			setSelectedIds((prev) => {
				const next = new Set(prev)
				for (const id of contentIds) {
					next.delete(id)
				}
				return next
			})
		}
	}

	const selectAllForAllLanguages = (checked: boolean) => {
		if (checked) {
			setSelectedIds(new Set(allIds))
		} else {
			setSelectedIds(new Set())
		}
	}

	const hasAllContentTypes =
		ALL_CONTENT_TYPES.every((ct) =>
			findContent(contents, ct.type, ct.isSummary)
		) && contents.length > 0

	if (contents.length === 0) {
		return (
			<div className='rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center'>
				<p className='font-semibold text-destructive'>
					Lingua non ancora tradotta!
				</p>
				<p className='mt-1 text-muted-foreground text-sm'>
					Per tradurre questo contenuto vai allo Step 2 e seleziona la
					lingua interessata
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Bulk checkboxes */}
			{isBozza && hasAllContentTypes && (
				<div className='flex flex-wrap items-center gap-6'>
					<div className='flex items-center gap-2'>
						<Checkbox
							checked={contentIds.every((id) =>
								selectedIds.has(id)
							)}
							id='select-all-lang'
							onCheckedChange={(v) =>
								selectAllForLanguage(v as boolean)
							}
						/>
						<Label
							className='font-normal text-sm'
							htmlFor='select-all-lang'
						>
							Seleziona tutti i contenuti per la lingua
							selezionata
						</Label>
					</div>

					<div className='flex items-center gap-2'>
						<Checkbox
							checked={
								allIds.length > 0 &&
								allIds.every((id) => selectedIds.has(id))
							}
							id='select-all-all'
							onCheckedChange={(v) =>
								selectAllForAllLanguages(v as boolean)
							}
						/>
						<Label
							className='font-normal text-sm'
							htmlFor='select-all-all'
						>
							Seleziona tutti i contenuti per ogni lingua
						</Label>
					</div>
				</div>
			)}

			{/* Content rows: Italian vs translated side by side */}
			{hasAllContentTypes ? (
				<div className='space-y-6'>
					{ALL_CONTENT_TYPES.map((ct) => {
						const italianContent = findContent(
							italianContents,
							ct.type,
							ct.isSummary
						)
						const translatedContent = findContent(
							contents,
							ct.type,
							ct.isSummary
						)
						return (
							<TranslationRow
								checked={selectedIds.has(
									translatedContent?.id ?? ''
								)}
								isBozza={isBozza}
								italianContent={italianContent?.content ?? ''}
								key={ct.label}
								label={ct.label}
								onCheckedChange={(checked) =>
									toggleId(
										translatedContent?.id ?? '',
										checked
									)
								}
								onSave={onSave}
								translatedContent={translatedContent}
							/>
						)
					})}
				</div>
			) : (
				<div className='rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center'>
					<p className='font-semibold text-destructive'>
						Lingua non ancora tradotta!
					</p>
					<p className='mt-1 text-muted-foreground text-sm'>
						Per tradurre questo contenuto vai allo Step 2 e
						seleziona la lingua interessata
					</p>
				</div>
			)}
		</div>
	)
}

function AudioContentBlock({
	label,
	content
}: {
	label: string
	content: PoiContent
}) {
	const isTtsRunning =
		content.jobTtsStatus === 'in_progress' ||
		content.jobTtsStatus === 'processing'
	const isTtsCompleted = content.jobTtsStatus === 'completed'
	const hasAudio = isTtsCompleted && !!content.media?.url

	return (
		<div className='space-y-3 rounded-lg border p-4'>
			<p className='font-semibold text-sm'>{label}</p>
			<Textarea readOnly rows={4} value={content.content ?? ''} />

			{isTtsRunning && (
				<div className='flex items-center gap-2 py-3 text-muted-foreground'>
					<Loader2 className='h-4 w-4 animate-spin' />
					<span className='text-sm'>
						Generazione audio in corso...
					</span>
				</div>
			)}

			{hasAudio && (
				<audio
					className='w-full'
					controls
					src={content.media?.url ?? undefined}
				>
					<track kind='captions' />
				</audio>
			)}

			{!(isTtsRunning || hasAudio) && (
				<p className='text-center text-destructive text-sm'>
					Contenuto non ancora generato, vai allo STEP 3 per procedere
					alla generazione
				</p>
			)}
		</div>
	)
}

function StepAudio({ contents }: { contents: PoiContent[] }) {
	const hasAllContentTypes =
		ALL_CONTENT_TYPES.every((ct) =>
			findContent(contents, ct.type, ct.isSummary)
		) && contents.length > 0

	if (contents.length === 0) {
		return (
			<div className='rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center'>
				<p className='font-semibold text-destructive'>
					Lingua non ancora generata!
				</p>
				<p className='mt-1 text-muted-foreground text-sm'>
					Per generare questo contenuto vai allo Step 3 e seleziona la
					lingua interessata
				</p>
			</div>
		)
	}

	if (!hasAllContentTypes) {
		return (
			<div className='rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center'>
				<p className='font-semibold text-destructive'>
					Lingua non ancora generata!
				</p>
				<p className='mt-1 text-muted-foreground text-sm'>
					Per generare questo contenuto vai allo Step 3 e seleziona la
					lingua interessata
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{ALL_CONTENT_TYPES.map((ct) => {
				const content = findContent(contents, ct.type, ct.isSummary)
				if (!content) {
					return null
				}
				return (
					<AudioContentBlock
						content={content}
						key={ct.label}
						label={ct.label}
					/>
				)
			})}
		</div>
	)
}

function getPoiName(poi: SitePoi | undefined): string {
	if (poi?.title) {
		return poi.title
	}
	if (poi?.description) {
		return poi.description
	}
	const namedContent = poi?.sitePoiContent?.find((c) => c.name)
	if (namedContent?.name) {
		return namedContent.name
	}
	return `Punto di interesse ${poi?.step ?? ''}`
}

function PoiDetailPage() {
	const { siteId, poiId } = useParams()
	const sid = siteId ?? raise('Missing siteId')
	const pid = poiId ?? raise('Missing poiId')

	const [polling, setPolling] = useState(false)
	const [showApproveDialog, setShowApproveDialog] = useState(false)

	const { data: site } = useSite(sid)
	const { data: poiData, isLoading } = usePoiContents(pid, polling)
	const updateContent = useUpdatePoiContent(pid)
	const cloneToTemp = useCloneToTemporary()
	const approve = useApprovePoiContent()

	const {
		selectedLanguage,
		isBozza,
		flowStep,
		setLanguage,
		setIsBozza,
		setFlowStep
	} = usePoiStore()

	const poi = site?.pointsOfInterest?.find((p) => p.id === pid)
	const poiName = getPoiName(poi)

	if (isLoading) {
		return <Skeleton className='h-[600px]' />
	}
	if (!poiData) {
		return <p>Contenuti non trovati</p>
	}

	const langCode = LANGUAGES[selectedLanguage as LanguageLabel] ?? 'it-IT'
	const hasTemporary = Object.keys(poiData.dataTemporary).length > 0
	const activeData = isBozza ? poiData.dataTemporary : poiData.dataPermanent
	const contents = activeData[langCode] ?? []

	// Italian contents for side-by-side comparison in translations step
	const italianContents =
		(isBozza
			? poiData.dataTemporary['it-IT']
			: poiData.dataPermanent['it-IT']) ?? []

	const currentStepIndex = FLOW_STEPS.findIndex((s) => s.key === flowStep)
	const isLastStep = currentStepIndex === FLOW_STEPS.length - 1
	const isFirstStep = currentStepIndex === 0

	const handleCloneToTemporary = () => {
		cloneToTemp.mutate(
			{ siteId: sid, poiId: pid },
			{
				onSuccess: () => {
					toast.success('Bozza creata')
					setIsBozza(true)
				},
				onError: () => toast.error('Errore nella creazione della bozza')
			}
		)
	}

	const handleApprove = () => {
		approve.mutate(
			{ siteId: sid, poiId: pid },
			{
				onSuccess: () => {
					toast.success('Contenuti pubblicati')
					setShowApproveDialog(false)
					setIsBozza(false)
				},
				onError: () => toast.error('Errore nella pubblicazione')
			}
		)
	}

	const handleNext = () => {
		if (isLastStep && isBozza) {
			setShowApproveDialog(true)
			return
		}
		if (isLastStep) {
			return
		}
		const nextStep = FLOW_STEPS[currentStepIndex + 1]
		setFlowStep(nextStep.key)
	}

	const handleBack = () => {
		if (isFirstStep) {
			return
		}
		const prevStep = FLOW_STEPS[currentStepIndex - 1]
		setFlowStep(prevStep.key)
	}

	const handleSave = (id: string, text: string) => {
		updateContent.mutate(
			{ contentId: id, content: text },
			{ onSuccess: () => toast.success('Testo aggiornato') }
		)
	}

	// Enable polling when any job is running
	const anyJobRunning = contents.some(
		(c) =>
			c.jobGenerationStatus === 'in_progress' ||
			c.jobGenerationStatus === 'processing' ||
			c.jobTranslationStatus === 'in_progress' ||
			c.jobTranslationStatus === 'processing' ||
			c.jobTtsStatus === 'in_progress' ||
			c.jobTtsStatus === 'processing'
	)
	if (anyJobRunning !== polling) {
		setPolling(anyJobRunning)
	}

	return (
		<div className='flex h-full flex-col'>
			<div className='min-h-0 flex-1 space-y-6 overflow-y-auto'>
				<h1 className='font-bold text-2xl'>
					Modifica &quot;{poiName}&quot;
				</h1>

				{/* Controls */}
				<div className='flex flex-wrap items-center gap-4'>
					<Select
						onValueChange={setLanguage}
						value={selectedLanguage}
					>
						<SelectTrigger className='w-[200px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.keys(LANGUAGES).map((lang) => (
								<SelectItem key={lang} value={lang}>
									{lang}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className='flex items-center gap-2'>
						<Label>Bozza</Label>
						<Switch
							checked={!isBozza}
							onCheckedChange={(checked) => setIsBozza(!checked)}
						/>
						<Label>Online</Label>
					</div>

					{!hasTemporary && (
						<Button
							disabled={cloneToTemp.isPending}
							onClick={handleCloneToTemporary}
							size='sm'
							variant='outline'
						>
							{cloneToTemp.isPending && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Crea bozza
						</Button>
					)}
				</div>

				{/* Step content */}
				<div className='mt-6'>
					{flowStep === 'textAndMedia' && (
						<StepTextAndMedia
							contents={contents}
							isBozza={isBozza}
							onSave={handleSave}
							poi={poi}
							siteId={sid}
						/>
					)}
					{flowStep === 'generatedTexts' && (
						<StepGeneratedTexts
							contents={contents}
							isBozza={isBozza}
							onSave={handleSave}
						/>
					)}
					{flowStep === 'translations' && (
						<StepTranslations
							allIds={poiData.allIds}
							contents={contents}
							isBozza={isBozza}
							italianContents={italianContents}
							onSave={handleSave}
						/>
					)}
					{flowStep === 'audio' && <StepAudio contents={contents} />}
				</div>
			</div>

			{/* Bottom stepper bar */}
			<div className='-mx-6 border-t bg-background px-6 py-4'>
				<div className='flex items-center justify-between'>
					<Button
						disabled={isFirstStep}
						onClick={handleBack}
						variant='ghost'
					>
						Indietro
					</Button>

					<div className='flex items-center gap-2'>
						{FLOW_STEPS.map((step, i) => (
							<div className='flex items-center' key={step.key}>
								<StepIndicator
									isActive={flowStep === step.key}
									onClick={() => setFlowStep(step.key)}
									step={step}
								/>
								{i < FLOW_STEPS.length - 1 && <StepSeparator />}
							</div>
						))}
					</div>

					<Button onClick={handleNext}>
						{isLastStep && isBozza ? 'Approva' : 'Avanti'}
					</Button>
				</div>
			</div>

			{/* Approve confirmation dialog */}
			<AlertDialog
				onOpenChange={setShowApproveDialog}
				open={showApproveDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Pubblica modifiche</AlertDialogTitle>
						<AlertDialogDescription>
							Sei sicuro di voler pubblicare le modifiche? I
							contenuti della bozza sostituiranno quelli online.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annulla</AlertDialogCancel>
						<AlertDialogAction
							disabled={approve.isPending}
							onClick={handleApprove}
						>
							{approve.isPending && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Conferma e pubblica
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default PoiDetailPage
