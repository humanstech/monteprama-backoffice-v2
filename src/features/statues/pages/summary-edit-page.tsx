import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { LANGUAGES, type LanguageLabel } from '@/constants/languages'
import type { FlowStep, PoiContent } from '@/features/poi/types'
import { useSummaries, useUpdateSummaryContent } from '../hooks'
import { useStatueStore } from '../stores/statue-store'

function SummaryEditPage() {
	const navigate = useNavigate()
	const { data: summary, isLoading } = useSummaries()
	const updateContent = useUpdateSummaryContent()
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
	if (!summary) {
		return <p>Nessun riepilogo trovato</p>
	}

	const langCode = LANGUAGES[selectedLanguage as LanguageLabel] ?? 'it-IT'
	const activeData = isBozza ? summary.dataTemporary : summary.dataPermanent
	const contents = activeData[langCode] ?? []

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
					Riepilogo - {summary.name ?? 'Sommario'}
				</h1>
			</div>

			<div className='flex flex-wrap items-center gap-4'>
				<Select onValueChange={setLanguage} value={selectedLanguage}>
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
			</div>

			<Tabs
				onValueChange={(v) => setFlowStep(v as FlowStep)}
				value={flowStep}
			>
				<TabsList>
					<TabsTrigger value='textAndMedia'>Testi</TabsTrigger>
					<TabsTrigger value='generatedTexts'>Generati</TabsTrigger>
					<TabsTrigger value='translations'>Traduzioni</TabsTrigger>
					<TabsTrigger value='audio'>Audio</TabsTrigger>
				</TabsList>

				<TabsContent className='mt-6 space-y-4' value='textAndMedia'>
					{contents.map((c) => (
						<SummaryContentBlock
							content={c}
							key={c.id}
							onSave={(contentId, text) => {
								updateContent.mutate(
									{ contentId, content: text },
									{
										onSuccess: () =>
											toast.success(
												'Contenuto aggiornato'
											)
									}
								)
							}}
						/>
					))}
					{contents.length === 0 && (
						<p className='text-muted-foreground'>
							Nessun contenuto.
						</p>
					)}
				</TabsContent>

				<TabsContent className='mt-6 space-y-4' value='generatedTexts'>
					{contents.map((c) => (
						<SummaryContentBlock content={c} key={c.id} readOnly />
					))}
				</TabsContent>

				<TabsContent className='mt-6 space-y-4' value='translations'>
					{contents.map((c) => (
						<SummaryContentBlock content={c} key={c.id} readOnly />
					))}
				</TabsContent>

				<TabsContent className='mt-6 space-y-4' value='audio'>
					{contents.map((c) => (
						<SummaryContentBlock
							content={c}
							key={c.id}
							readOnly
							showAudio
						/>
					))}
				</TabsContent>
			</Tabs>
		</div>
	)
}

function SummaryContentBlock({
	content,
	onSave,
	readOnly,
	showAudio
}: {
	content: PoiContent
	onSave?: (id: string, text: string) => void
	readOnly?: boolean
	showAudio?: boolean
}) {
	const [text, setText] = useState(content.content ?? '')

	return (
		<div className='space-y-3 rounded-lg border p-4'>
			<p className='font-medium text-sm'>
				{content.name ?? content.type ?? 'Contenuto'}
			</p>
			<Textarea
				onChange={(e) => setText(e.target.value)}
				readOnly={readOnly}
				rows={4}
				value={text}
			/>
			{!readOnly && onSave && content.id && (
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
		</div>
	)
}

export default SummaryEditPage
