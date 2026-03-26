import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import type { User } from '@/features/auth/types'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks'
import { CreateUserSchema } from '../types'

type CreateUserFormValues = z.input<typeof CreateUserSchema>

function UsersPage() {
	const { data: users, isLoading } = useUsers()
	const createUser = useCreateUser()
	const updateUser = useUpdateUser()
	const deleteUser = useDeleteUser()

	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [deletingUser, setDeletingUser] = useState<User | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors }
	} = useForm<CreateUserFormValues>({
		resolver: zodResolver(CreateUserSchema)
	})

	const openCreate = () => {
		setEditingUser(null)
		reset({ firstName: '', lastName: '', email: '', isAdmin: false })
		setIsFormOpen(true)
	}

	const openEdit = (user: User) => {
		setEditingUser(user)
		reset({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email ?? '',
			isAdmin: user.isAdmin
		})
		setIsFormOpen(true)
	}

	const onSubmit = async (values: CreateUserFormValues) => {
		const parsed = CreateUserSchema.parse(values)
		try {
			if (editingUser) {
				await updateUser.mutateAsync({ id: editingUser.id, ...parsed })
				toast.success('Utente aggiornato')
			} else {
				await createUser.mutateAsync(parsed)
				toast.success('Utente creato')
			}
			setIsFormOpen(false)
		} catch {
			toast.error('Errore durante il salvataggio')
		}
	}

	const handleDelete = async () => {
		if (!deletingUser?.id) {
			return
		}
		try {
			await deleteUser.mutateAsync(deletingUser.id)
			toast.success('Utente eliminato')
		} catch {
			toast.error("Errore durante l'eliminazione")
		}
		setDeletingUser(null)
	}

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<h1 className='font-bold text-2xl'>Utenti</h1>
				<Skeleton className='h-[400px]' />
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='font-bold text-2xl'>Utenti</h1>
				<Button onClick={openCreate}>Nuovo utente</Button>
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>Cognome</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Admin</TableHead>
							<TableHead>Attivo</TableHead>
							<TableHead className='w-[80px]'>Azioni</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users?.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.firstName}</TableCell>
								<TableCell>{user.lastName}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									{user.isAdmin ? 'Si' : 'No'}
								</TableCell>
								<TableCell>
									{user.isActive ? 'Si' : 'No'}
								</TableCell>
								<TableCell>
									<div className='flex gap-1'>
										<Button
											className='size-8'
											onClick={() => openEdit(user)}
											size='icon'
											variant='ghost'
										>
											<Pencil className='size-4' />
										</Button>
										<Button
											className='size-8 text-destructive hover:text-destructive'
											onClick={() =>
												setDeletingUser(user)
											}
											size='icon'
											variant='ghost'
										>
											<Trash2 className='size-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Create/Edit Form Dialog */}
			<Dialog onOpenChange={setIsFormOpen} open={isFormOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingUser ? 'Modifica utente' : 'Nuovo utente'}
						</DialogTitle>
						<DialogDescription>
							{editingUser
								? "Modifica i dati dell'utente selezionato."
								: 'Inserisci i dati del nuovo utente.'}
						</DialogDescription>
					</DialogHeader>
					<form
						className='space-y-4'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>Nome</Label>
							<Input id='firstName' {...register('firstName')} />
							{errors.firstName && (
								<p className='text-destructive text-sm'>
									{errors.firstName.message}
								</p>
							)}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lastName'>Cognome</Label>
							<Input id='lastName' {...register('lastName')} />
							{errors.lastName && (
								<p className='text-destructive text-sm'>
									{errors.lastName.message}
								</p>
							)}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								{...register('email')}
							/>
							{errors.email && (
								<p className='text-destructive text-sm'>
									{errors.email.message}
								</p>
							)}
						</div>
						<div className='flex items-center gap-2'>
							<Checkbox
								checked={watch('isAdmin')}
								id='isAdmin'
								onCheckedChange={(checked) =>
									setValue('isAdmin', checked === true)
								}
							/>
							<Label htmlFor='isAdmin'>Amministratore</Label>
						</div>
						<DialogFooter>
							<Button
								onClick={() => setIsFormOpen(false)}
								type='button'
								variant='outline'
							>
								Annulla
							</Button>
							<Button
								disabled={
									createUser.isPending || updateUser.isPending
								}
								type='submit'
							>
								Salva
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete confirmation */}
			<AlertDialog
				onOpenChange={() => setDeletingUser(null)}
				open={!!deletingUser}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminare l'utente?</AlertDialogTitle>
						<AlertDialogDescription>
							Stai per eliminare {deletingUser?.firstName}{' '}
							{deletingUser?.lastName}. Questa azione non può
							essere annullata.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annulla</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Elimina
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default UsersPage
