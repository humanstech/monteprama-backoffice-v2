import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
	useCreateTicketCategory,
	useDeleteTicketCategory,
	useDeleteTicketOption,
	useTickets,
	useUpdateTicketOption
} from '../hooks'

function TicketsSection({ siteId }: { siteId: string }) {
	const { data: ticketResponse, isLoading } = useTickets(siteId)
	const createCategory = useCreateTicketCategory(siteId)
	const updateOption = useUpdateTicketOption(siteId)
	const deleteOption = useDeleteTicketOption(siteId)
	const deleteCategory = useDeleteTicketCategory(siteId)

	const [newCatName, setNewCatName] = useState('')
	const [newCatNote, setNewCatNote] = useState('')

	if (isLoading) {
		return <Skeleton className='h-[300px]' />
	}

	const categories = ticketResponse?.data?.['it-IT'] ?? []
	const categoryList = (Array.isArray(categories) ? categories : []).filter(
		(cat): cat is typeof cat & { id: string } => !!cat.id
	)

	const handleCreateCategory = async () => {
		if (!newCatName.trim()) {
			return
		}
		try {
			await createCategory.mutateAsync({
				name: newCatName,
				description: newCatNote,
				language: 'it-IT'
			})
			setNewCatName('')
			setNewCatNote('')
			toast.success('Categoria creata')
		} catch {
			toast.error('Errore nella creazione')
		}
	}

	return (
		<div className='space-y-6'>
			<h2 className='font-semibold text-lg'>Biglietti</h2>

			{categoryList.map((cat) => (
				<div className='space-y-3 rounded-lg border p-4' key={cat.id}>
					<div className='flex items-center justify-between'>
						<h3 className='font-medium'>{cat.name}</h3>
						<Button
							onClick={() => {
								deleteCategory.mutate(cat.id, {
									onSuccess: () =>
										toast.success('Categoria eliminata')
								})
							}}
							size='icon'
							variant='ghost'
						>
							<Trash2 className='size-4' />
						</Button>
					</div>
					{cat.description && (
						<p className='text-muted-foreground text-sm'>
							{cat.description}
						</p>
					)}

					{cat.ticketOptions
						?.filter((o): o is typeof o & { id: string } => !!o.id)
						.map((option) => (
							<TicketOptionRow
								key={option.id}
								onDelete={() => {
									deleteOption.mutate(
										{
											categoryId: cat.id,
											optionId: option.id
										},
										{
											onSuccess: () =>
												toast.success(
													'Opzione eliminata'
												)
										}
									)
								}}
								onSave={(title, price) => {
									updateOption.mutate(
										{
											categoryId: cat.id,
											optionId: option.id,
											title,
											price
										},
										{
											onSuccess: () =>
												toast.success(
													'Opzione aggiornata'
												)
										}
									)
								}}
								option={option}
							/>
						))}

					<NewOptionRow
						onAdd={(title, price) => {
							updateOption.mutate(
								{ categoryId: cat.id, title, price },
								{
									onSuccess: () =>
										toast.success('Opzione aggiunta')
								}
							)
						}}
					/>
				</div>
			))}

			{/* New category form */}
			<div className='space-y-3 rounded-lg border border-dashed p-4'>
				<h3 className='font-medium'>Nuova categoria</h3>
				<div className='flex gap-2'>
					<Input
						onChange={(e) => setNewCatName(e.target.value)}
						placeholder='Nome'
						value={newCatName}
					/>
					<Input
						onChange={(e) => setNewCatNote(e.target.value)}
						placeholder='Note'
						value={newCatNote}
					/>
					<Button
						disabled={createCategory.isPending}
						onClick={handleCreateCategory}
					>
						<Plus className='mr-1 size-4' /> Crea
					</Button>
				</div>
			</div>
		</div>
	)
}

function TicketOptionRow({
	option,
	onSave,
	onDelete
}: {
	option: { id?: string | null; title?: string | null; price?: number | null }
	onSave: (title: string, price: number) => void
	onDelete: () => void
}) {
	const [title, setTitle] = useState(option.title ?? '')
	const [price, setPrice] = useState(String(option.price ?? 0))

	return (
		<div className='flex items-center gap-2'>
			<Input
				className='flex-1'
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Descrizione'
				value={title}
			/>
			<Input
				className='w-24'
				onChange={(e) => setPrice(e.target.value)}
				placeholder='Prezzo'
				type='number'
				value={price}
			/>
			<Button onClick={() => onSave(title, Number(price))} size='sm'>
				Salva
			</Button>
			<Button onClick={onDelete} size='icon' variant='ghost'>
				<Trash2 className='size-4' />
			</Button>
		</div>
	)
}

function NewOptionRow({
	onAdd
}: {
	onAdd: (title: string, price: number) => void
}) {
	const [title, setTitle] = useState('')
	const [price, setPrice] = useState('')

	return (
		<div className='flex items-center gap-2'>
			<Input
				className='flex-1'
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Nuova opzione'
				value={title}
			/>
			<Input
				className='w-24'
				onChange={(e) => setPrice(e.target.value)}
				placeholder='Prezzo'
				type='number'
				value={price}
			/>
			<Button
				disabled={!title.trim()}
				onClick={() => {
					onAdd(title, Number(price) || 0)
					setTitle('')
					setPrice('')
				}}
				size='sm'
				variant='outline'
			>
				<Plus className='mr-1 size-4' /> Aggiungi
			</Button>
		</div>
	)
}

export { TicketsSection }
