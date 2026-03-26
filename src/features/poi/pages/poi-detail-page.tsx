import { useState } from 'react'
import { useParams } from 'react-router'
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
import { raise } from '@/helpers/utils'
import { usePoiContents, useUpdatePoiContent, useVoices } from '../hooks'
import { usePoiStore } from '../stores/poi-store'
import type { PoiContent } from '../types'

function ContentItem({
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
			<div className='flex items-center justify-between'>
				<p className='font-medium text-sm'>
					{content.name ?? content.type ?? 'Contenuto'}
				</p>
				<div className='flex gap-2 text-muted-foreground text-xs'>
					{content.jobGenerationStatus && (
						<span>Gen: {content.jobGenerationStatus}</span>
					)}
					{content.jobTranslationStatus && (
						<span>Trad: {content.jobTranslationStatus}</span>
					)}
					{content.jobTtsStatus && (
						<span>TTS: {content.jobTtsStatus}</span>
					)}
				</div>
			</div>

			<Textarea
				onChange={(e) => setText(e.target.value)}
				readOnly={readOnly}
				rows={4}
				value={text}
			/>

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
		</div>
	)
}

function ContentList({
	contents,
	onSave,
	readOnly,
	showAudio
}: {
	contents: PoiContent[]
	onSave?: (id: string, text: string) => void
	readOnly?: boolean
	showAudio?: boolean
}) {
	return (
		<div className='space-y-4'>
			{contents.length === 0 && (
				<p className='text-muted-foreground'>
					Nessun contenuto per questa lingua.
				</p>
			)}
			{contents.map((content) => (
				<ContentItem
					content={content}
					key={content.id}
					onSave={onSave}
					readOnly={readOnly}
					showAudio={showAudio}
				/>
			))}
		</div>
	)
}

function PoiDetailPage() {
	const { poiId } = useParams()
	const pid = poiId ?? raise('Missing poiId')

	const { data: poiData, isLoading } = usePoiContents(pid)
	const { data: voices } = useVoices()
	const updateContent = useUpdatePoiContent(pid)

	const {
		selectedLanguage,
		isBozza,
		flowStep,
		setLanguage,
		setIsBozza,
		setFlowStep
	} = usePoiStore()

	if (isLoading) {
		return <Skeleton className='h-[600px]' />
	}
	if (!poiData) {
		return <p>Contenuti non trovati</p>
	}

	const langCode = LANGUAGES[selectedLanguage as LanguageLabel] ?? 'it-IT'
	const activeData = isBozza ? poiData.dataTemporary : poiData.dataPermanent
	const contents = activeData[langCode] ?? []
	const defaultVoice = voices?.find((v) => v.isDefault)

	return (
		<div className='space-y-6'>
			<h1 className='font-bold text-2xl'>Modifica POI</h1>

			{/* Controls: language selector + draft/online toggle */}
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

			{/* Flow steps */}
			<Tabs
				onValueChange={(v) => setFlowStep(v as typeof flowStep)}
				value={flowStep}
			>
				<TabsList>
					<TabsTrigger value='textAndMedia'>
						Testi e Media
					</TabsTrigger>
					<TabsTrigger value='generatedTexts'>
						Testi generati
					</TabsTrigger>
					<TabsTrigger value='translations'>Traduzioni</TabsTrigger>
					<TabsTrigger value='audio'>Audio</TabsTrigger>
				</TabsList>

				<TabsContent className='mt-6' value='textAndMedia'>
					<ContentList
						contents={contents}
						onSave={(id, text) => {
							updateContent.mutate(
								{ contentId: id, content: text },
								{
									onSuccess: () =>
										toast.success('Testo aggiornato')
								}
							)
						}}
					/>
				</TabsContent>

				<TabsContent className='mt-6' value='generatedTexts'>
					<ContentList contents={contents} readOnly />
					<p className='mt-4 text-muted-foreground text-sm'>
						Usa il pulsante per generare testi alternativi per i
						contenuti selezionati.
					</p>
				</TabsContent>

				<TabsContent className='mt-6' value='translations'>
					<ContentList contents={contents} readOnly />
					<p className='mt-4 text-muted-foreground text-sm'>
						Seleziona le lingue target e avvia la traduzione.
					</p>
				</TabsContent>

				<TabsContent className='mt-6' value='audio'>
					<ContentList contents={contents} readOnly showAudio />
					{defaultVoice && (
						<p className='mt-4 text-muted-foreground text-sm'>
							Voce predefinita: {defaultVoice.key}
						</p>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default PoiDetailPage
