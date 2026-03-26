import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
	useCreateInfoSite,
	useDeleteInfoSite,
	useInfoSiteCategories,
	useInfoSites,
	useUpdateInfoSite
} from '../hooks'
import type { InfoSite } from '../types'

function InfoSitesSection({ siteId }: { siteId: string }) {
	const { data: categories, isLoading: loadingCats } =
		useInfoSiteCategories(siteId)
	const { data: infoSitesByLang, isLoading: loadingInfos } =
		useInfoSites(siteId)
	const updateInfoSite = useUpdateInfoSite(siteId)
	const deleteInfoSite = useDeleteInfoSite(siteId)
	const createInfoSite = useCreateInfoSite(siteId)

	if (loadingCats || loadingInfos) {
		return <Skeleton className='h-[300px]' />
	}

	const italianInfoSites = infoSitesByLang?.['it-IT'] ?? []

	// Group info sites by category
	const byCategoryId: Record<string, InfoSite[]> = {}
	for (const info of italianInfoSites) {
		const catId = info.categoryId ?? 'unknown'
		if (!byCategoryId[catId]) {
			byCategoryId[catId] = []
		}
		byCategoryId[catId].push(info)
	}

	return (
		<div className='space-y-6'>
			<h2 className='font-semibold text-lg'>Informazioni sito</h2>

			{categories?.map((cat) => {
				const catId = cat.id ?? ''
				const items = byCategoryId[catId] ?? []
				return (
					<div
						className='space-y-3 rounded-lg border p-4'
						key={cat.id}
					>
						<h3 className='font-medium'>{cat.category}</h3>

						{items.map((info) => {
							const infoId = info.id ?? ''
							return (
								<InfoSiteRow
									info={info}
									key={info.id}
									onDelete={() => {
										deleteInfoSite.mutate(
											{
												categoryId: catId,
												infoSiteId: infoId
											},
											{
												onSuccess: () =>
													toast.success(
														'Info eliminata'
													)
											}
										)
									}}
									onSave={(title, description) => {
										updateInfoSite.mutate(
											{
												categoryId: catId,
												infoSiteId: infoId,
												title,
												description
											},
											{
												onSuccess: () =>
													toast.success(
														'Info aggiornata'
													)
											}
										)
									}}
								/>
							)
						})}

						<NewInfoRow
							onAdd={(title, description) => {
								createInfoSite.mutate(
									{
										title,
										description,
										categoryId: catId
									},
									{
										onSuccess: () =>
											toast.success('Info creata')
									}
								)
							}}
						/>
					</div>
				)
			})}
		</div>
	)
}

function InfoSiteRow({
	info,
	onSave,
	onDelete
}: {
	info: InfoSite
	onSave: (title: string, description: string) => void
	onDelete: () => void
}) {
	const [title, setTitle] = useState(info.title ?? '')
	const [description, setDescription] = useState(info.description ?? '')

	return (
		<div className='space-y-2 rounded-md bg-muted/50 p-3'>
			<Input
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Titolo'
				value={title}
			/>
			<Textarea
				onChange={(e) => setDescription(e.target.value)}
				placeholder='Descrizione'
				rows={2}
				value={description}
			/>
			<div className='flex justify-end gap-2'>
				<Button onClick={() => onSave(title, description)} size='sm'>
					Salva
				</Button>
				<Button onClick={onDelete} size='icon' variant='ghost'>
					<Trash2 className='size-4' />
				</Button>
			</div>
		</div>
	)
}

function NewInfoRow({
	onAdd
}: {
	onAdd: (title: string, description: string) => void
}) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	return (
		<div className='space-y-2 rounded-md border border-dashed p-3'>
			<Input
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Nuovo titolo'
				value={title}
			/>
			<Textarea
				onChange={(e) => setDescription(e.target.value)}
				placeholder='Descrizione'
				rows={2}
				value={description}
			/>
			<Button
				disabled={!title.trim()}
				onClick={() => {
					onAdd(title, description)
					setTitle('')
					setDescription('')
				}}
				size='sm'
				variant='outline'
			>
				<Plus className='mr-1 size-4' /> Aggiungi
			</Button>
		</div>
	)
}

export { InfoSitesSection }
