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
import { useVoices } from '@/features/poi/hooks'
import type { FlowStep, PoiContent } from '@/features/poi/types'
import { raise } from '@/helpers/utils'
import {
	useApproveStatueContent,
	useCloneStatueContentToTemporary,
	useGenerateStatueContent,
	useStatueContentTts,
	useStatues,
	useTranslateStatueContent,
	useUpdateStatueContent
} from '../hooks'
import { useStatueStore } from '../stores/statue-store'

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
			className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
				isActive
					? 'border border-primary text-primary'
					: 'text-muted-foreground hover:text-foreground'
			}`}
			onClick={onClick}
			type='button'
		>
			<span
				className={`flex h-7 w-7 items-center justify-center rounded-md font-medium text-sm text-white ${
					isActive ? 'bg-primary' : 'bg-primary/40'
				}`}
			>
				{step.number}
			</span>
			<span className='font-semibold text-sm'>{step.label}</span>
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
					Audio non ancora generato.
				</p>
			)}
		</div>
	)
}

function StepTextAndMedia({
	contents,
	onSave
}: {
	contents: PoiContent[]
	onSave: (id: string, text: string) => void
}) {
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
					onSave={onSave}
				/>
			))}
		</div>
	)
}

function StepGeneratedTexts({
	contents,
	isBozza,
	statueId,
	onSave
}: {
	contents: PoiContent[]
	isBozza: boolean
	statueId: string
	onSave: (id: string, text: string) => void
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const generate = useGenerateStatueContent()

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
				statueId,
				body: {
					quoteMode: false,
					statueContentIds: [...selectedIds]
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
	statueId,
	onSave
}: {
	contents: PoiContent[]
	isBozza: boolean
	statueId: string
	onSave: (id: string, text: string) => void
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(
		new Set()
	)
	const translate = useTranslateStatueContent()

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
				statueId,
				body: {
					quoteMode: false,
					statueContentIds: [...selectedIds],
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
									id={`statue-lang-${code}`}
									onCheckedChange={(checked) =>
										toggleLanguage(code, checked as boolean)
									}
								/>
								<Label
									className='font-normal text-sm'
									htmlFor={`statue-lang-${code}`}
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
	statueId,
	defaultVoice
}: {
	contents: PoiContent[]
	isBozza: boolean
	statueId: string
	defaultVoice?: { key: string; voiceId: string }
}) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const tts = useStatueContentTts()

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
				statueId,
				body: {
					quoteMode: false,
					statueContentIds: [...selectedIds],
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

function StatueContentPage() {
	const { statueId } = useParams()
	const id = statueId ?? raise('Missing statueId')
	const { data: statues, isLoading } = useStatues()
	const { data: voices } = useVoices()
	const updateContent = useUpdateStatueContent()
	const cloneToTemp = useCloneStatueContentToTemporary()
	const approve = useApproveStatueContent()

	const [showApproveDialog, setShowApproveDialog] = useState(false)

	const {
		selectedLanguage,
		isBozza,
		flowStep,
		setLanguage,
		setIsBozza,
		setFlowStep
	} = useStatueStore()

	if (isLoading) {
		return <Skeleton className='h-[600px]' />
	}

	const statue = statues?.find((s) => s.id === id)
	if (!statue) {
		return <p>Statua non trovata</p>
	}

	const langCode = LANGUAGES[selectedLanguage as LanguageLabel] ?? 'it-IT'
	const hasTemporary = Object.keys(statue.dataTemporary).length > 0
	const activeData = isBozza ? statue.dataTemporary : statue.dataPermanent
	const contents = activeData[langCode] ?? []
	const defaultVoice = voices?.find((v) => v.isDefault)

	const currentStepIndex = FLOW_STEPS.findIndex((s) => s.key === flowStep)
	const isLastStep = currentStepIndex === FLOW_STEPS.length - 1
	const isFirstStep = currentStepIndex === 0

	const handleCloneToTemporary = () => {
		cloneToTemp.mutate(id, {
			onSuccess: () => {
				toast.success('Bozza creata')
				setIsBozza(true)
			},
			onError: () => toast.error('Errore nella creazione della bozza')
		})
	}

	const handleApprove = () => {
		approve.mutate(id, {
			onSuccess: () => {
				toast.success('Contenuti pubblicati')
				setShowApproveDialog(false)
				setIsBozza(false)
			},
			onError: () => toast.error('Errore nella pubblicazione')
		})
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
			{ onSuccess: () => toast.success('Contenuto aggiornato') }
		)
	}

	return (
		<div className='flex min-h-[calc(100vh-8rem)] flex-col'>
			<div className='flex-1 space-y-6'>
				<h1 className='font-bold text-2xl'>
					Contenuti - {statue.name ?? 'Statua'}
				</h1>

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

				<div className='mt-6'>
					{flowStep === 'textAndMedia' && (
						<StepTextAndMedia
							contents={contents}
							onSave={handleSave}
						/>
					)}
					{flowStep === 'generatedTexts' && (
						<StepGeneratedTexts
							contents={contents}
							isBozza={isBozza}
							onSave={handleSave}
							statueId={id}
						/>
					)}
					{flowStep === 'translations' && (
						<StepTranslations
							contents={contents}
							isBozza={isBozza}
							onSave={handleSave}
							statueId={id}
						/>
					)}
					{flowStep === 'audio' && (
						<StepAudio
							contents={contents}
							defaultVoice={defaultVoice}
							isBozza={isBozza}
							statueId={id}
						/>
					)}
				</div>
			</div>

			{/* Bottom stepper bar */}
			<div className='sticky bottom-0 mt-8 border-t bg-background py-4'>
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

export default StatueContentPage
