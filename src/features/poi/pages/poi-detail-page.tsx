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
	useGeneratePoiContent,
	usePoiContents,
	useTranslatePoiContent,
	useTtsPoiContent,
	useUpdatePoiContent,
	useUpdatePoiCoordinates,
	useVoices
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

function ContentItem({
	content,
	onSave,
	readOnly,
	showAudio,
	selectable,
	selected,
	onSelectChange
}: {
	content: PoiContent
	onSave?: (id: string, text: string) => void
	readOnly?: boolean
	showAudio?: boolean
	selectable?: boolean
	selected?: boolean
	onSelectChange?: (checked: boolean) => void
}) {
	const [text, setText] = useState(content.content ?? '')

	const isJobRunning =
		content.jobGenerationStatus === 'in_progress' ||
		content.jobGenerationStatus === 'processing' ||
		content.jobTranslationStatus === 'in_progress' ||
		content.jobTranslationStatus === 'processing' ||
		content.jobTtsStatus === 'in_progress' ||
		content.jobTtsStatus === 'processing'

	return (
		<div className='space-y-3 rounded-lg border p-4'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					{selectable && content.id && (
						<Checkbox
							checked={selected}
							onCheckedChange={onSelectChange}
						/>
					)}
					<p className='font-medium text-sm'>
						{content.name ?? content.type ?? 'Contenuto'}
					</p>
				</div>
				<div className='flex items-center gap-2 text-xs'>
					{isJobRunning && (
						<Loader2 className='h-3 w-3 animate-spin' />
					)}
					<JobBadge
						label='Generazione'
						status={content.jobGenerationStatus}
					/>
					<JobBadge
						label='Traduzione'
						status={content.jobTranslationStatus}
					/>
					<JobBadge label='Audio' status={content.jobTtsStatus} />
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
					readOnly={readOnly}
					rows={4}
					value={text}
				/>
			)}

			{!readOnly && onSave && content.id != null && (
				<Button
					disabled={text === content.content}
					onClick={() => onSave(content.id as string, text)}
					size='sm'
				>
					Salva
				</Button>
			)}

			{showAudio && content.media?.url && (
				<audio className='w-full' controls src={content.media.url}>
					<track kind='captions' />
				</audio>
			)}
			{showAudio && !content.media?.url && (
				<p className='text-muted-foreground text-xs'>
					Audio non ancora generato. Vai allo Step 3 per generare.
				</p>
			)}
		</div>
	)
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

function StepGeneratedTexts({
	contents,
	isBozza,
	siteId,
	poiId,
	onSave
}: {
	contents: PoiContent[]
	isBozza: boolean
	siteId: string
	poiId: string
	onSave: (id: string, text: string) => void
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const generate = useGeneratePoiContent()

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

	const handleGenerate = () => {
		if (selectedIds.size === 0) {
			toast.error('Seleziona almeno un contenuto da generare')
			return
		}
		generate.mutate(
			{
				siteId,
				poiId,
				body: {
					quoteMode: false,
					sitePoiContentIds: [...selectedIds]
				}
			},
			{
				onSuccess: () => {
					toast.success('Generazione avviata')
					setSelectedIds(new Set())
				},
				onError: () => toast.error('Errore nella generazione')
			}
		)
	}

	if (contents.length === 0) {
		return (
			<p className='text-muted-foreground'>
				Nessun contenuto per questa lingua.
			</p>
		)
	}

	return (
		<div className='space-y-4'>
			{contents.map((content) => (
				<ContentItem
					content={content}
					key={content.id}
					onSave={isBozza ? onSave : undefined}
					onSelectChange={(checked) =>
						toggleId(content.id ?? '', checked as boolean)
					}
					readOnly={!isBozza}
					selectable={isBozza}
					selected={selectedIds.has(content.id ?? '')}
				/>
			))}
			{isBozza && (
				<Button
					disabled={selectedIds.size === 0 || generate.isPending}
					onClick={handleGenerate}
				>
					{generate.isPending && (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					)}
					Genera testi alternativi ({selectedIds.size})
				</Button>
			)}
		</div>
	)
}

function StepTranslations({
	contents,
	isBozza,
	siteId,
	poiId,
	onSave
}: {
	contents: PoiContent[]
	isBozza: boolean
	siteId: string
	poiId: string
	onSave: (id: string, text: string) => void
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(
		new Set()
	)
	const translate = useTranslatePoiContent()

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

	const toggleLanguage = (lang: string, checked: boolean) => {
		setSelectedLanguages((prev) => {
			const next = new Set(prev)
			if (checked) {
				next.add(lang)
			} else {
				next.delete(lang)
			}
			return next
		})
	}

	const selectAllContents = (checked: boolean) => {
		if (checked) {
			setSelectedIds(
				new Set(
					contents
						.map((c) => c.id)
						.filter((id): id is string => id != null)
				)
			)
		} else {
			setSelectedIds(new Set())
		}
	}

	const handleTranslate = () => {
		if (selectedIds.size === 0) {
			toast.error('Seleziona almeno un contenuto da tradurre')
			return
		}
		if (selectedLanguages.size === 0) {
			toast.error('Seleziona almeno una lingua target')
			return
		}
		translate.mutate(
			{
				siteId,
				poiId,
				body: {
					quoteMode: false,
					sitePoiContentIds: [...selectedIds],
					languages: [...selectedLanguages]
				}
			},
			{
				onSuccess: () => {
					toast.success('Traduzione avviata')
					setSelectedIds(new Set())
					setSelectedLanguages(new Set())
				},
				onError: () => toast.error('Errore nella traduzione')
			}
		)
	}

	if (contents.length === 0) {
		return (
			<p className='text-muted-foreground'>
				Nessun contenuto per questa lingua.
			</p>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='space-y-4'>
				{isBozza && (
					<div className='flex items-center gap-2'>
						<Checkbox
							checked={
								selectedIds.size === contents.length &&
								contents.length > 0
							}
							onCheckedChange={selectAllContents}
						/>
						<Label className='text-sm'>
							Seleziona tutti i contenuti
						</Label>
					</div>
				)}
				{contents.map((content) => (
					<ContentItem
						content={content}
						key={content.id}
						onSave={isBozza ? onSave : undefined}
						onSelectChange={(checked) =>
							toggleId(content.id ?? '', checked as boolean)
						}
						readOnly={!isBozza}
						selectable={isBozza}
						selected={selectedIds.has(content.id ?? '')}
					/>
				))}
			</div>

			{isBozza && (
				<div className='space-y-3 rounded-lg border p-4'>
					<p className='font-medium text-sm'>Lingue target</p>
					<div className='grid grid-cols-3 gap-2'>
						{Object.entries(LANGUAGES).map(([langLabel, code]) => (
							<div className='flex items-center gap-2' key={code}>
								<Checkbox
									checked={selectedLanguages.has(code)}
									id={`lang-${code}`}
									onCheckedChange={(checked) =>
										toggleLanguage(code, checked as boolean)
									}
								/>
								<Label
									className='font-normal text-sm'
									htmlFor={`lang-${code}`}
								>
									{langLabel}
								</Label>
							</div>
						))}
					</div>
					<Button
						disabled={
							selectedIds.size === 0 ||
							selectedLanguages.size === 0 ||
							translate.isPending
						}
						onClick={handleTranslate}
					>
						{translate.isPending && (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						)}
						Traduci ({selectedIds.size} contenuti in{' '}
						{selectedLanguages.size} lingue)
					</Button>
				</div>
			)}
		</div>
	)
}

function StepAudio({
	contents,
	isBozza,
	siteId,
	poiId,
	defaultVoice
}: {
	contents: PoiContent[]
	isBozza: boolean
	siteId: string
	poiId: string
	defaultVoice?: { key: string; voiceId: string }
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const tts = useTtsPoiContent()

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

	const handleTts = () => {
		if (!defaultVoice) {
			toast.error('Nessuna voce disponibile')
			return
		}
		if (selectedIds.size === 0) {
			toast.error('Seleziona almeno un contenuto')
			return
		}
		tts.mutate(
			{
				siteId,
				poiId,
				body: {
					quoteMode: false,
					sitePoiContentIds: [...selectedIds],
					voiceKeys: [defaultVoice.voiceId]
				}
			},
			{
				onSuccess: () => {
					toast.success('Generazione audio avviata')
					setSelectedIds(new Set())
				},
				onError: () => toast.error('Errore nella generazione audio')
			}
		)
	}

	if (contents.length === 0) {
		return (
			<p className='text-muted-foreground'>
				Nessun contenuto per questa lingua.
			</p>
		)
	}

	return (
		<div className='space-y-4'>
			{contents.map((content) => (
				<ContentItem
					content={content}
					key={content.id}
					onSelectChange={(checked) =>
						toggleId(content.id ?? '', checked as boolean)
					}
					readOnly
					selectable={isBozza}
					selected={selectedIds.has(content.id ?? '')}
					showAudio
				/>
			))}
			{isBozza && defaultVoice && (
				<div className='flex items-center gap-4'>
					<Button
						disabled={selectedIds.size === 0 || tts.isPending}
						onClick={handleTts}
					>
						{tts.isPending && (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						)}
						Genera audio ({selectedIds.size})
					</Button>
					<p className='text-muted-foreground text-sm'>
						Voce: {defaultVoice.key}
					</p>
				</div>
			)}
		</div>
	)
}

function PoiDetailPage() {
	const { siteId, poiId } = useParams()
	const sid = siteId ?? raise('Missing siteId')
	const pid = poiId ?? raise('Missing poiId')

	const [polling, setPolling] = useState(false)
	const [showApproveDialog, setShowApproveDialog] = useState(false)

	const { data: site } = useSite(sid)
	const { data: poiData, isLoading } = usePoiContents(pid, polling)
	const { data: voices } = useVoices()
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
	const poiName =
		poi?.title ??
		poi?.description ??
		poi?.sitePoiContent?.find((c) => c.name)?.name ??
		`Punto di interesse ${poi?.step ?? ''}`

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
	const defaultVoice = voices?.find((v) => v.isDefault)

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
		if (isLastStep) {
			if (isBozza) {
				setShowApproveDialog(true)
			}
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
							poiId={pid}
							siteId={sid}
						/>
					)}
					{flowStep === 'translations' && (
						<StepTranslations
							contents={contents}
							isBozza={isBozza}
							onSave={handleSave}
							poiId={pid}
							siteId={sid}
						/>
					)}
					{flowStep === 'audio' && (
						<StepAudio
							contents={contents}
							defaultVoice={defaultVoice}
							isBozza={isBozza}
							poiId={pid}
							siteId={sid}
						/>
					)}
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
