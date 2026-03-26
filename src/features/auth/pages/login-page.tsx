import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAsync } from '@/hooks/use-async'
import { authApi } from '../api'
import { useAuthStore } from '../stores/store'

const loginSchema = z.object({
	email: z.string().email('Email non valida'),
	password: z.string().min(1, 'Password obbligatoria')
})
type LoginForm = z.infer<typeof loginSchema>

function LoginPage() {
	const navigate = useNavigate()
	const { setAuth } = useAuthStore()
	const { isLoading, run } = useAsync()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema)
	})

	const onSubmit = (values: LoginForm) => {
		run(
			authApi.login(values.email, values.password).then((data) => {
				setAuth({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					user: data.user
				})
				navigate('/sites')
			})
		).catch(() => {
			toast.error('Credenziali non valide')
		})
	}

	return (
		<div className='flex min-h-screen'>
			<div className='flex flex-1 items-center justify-center'>
				<div className='w-full max-w-[420px] space-y-10 px-5'>
					<h1 className='font-bold text-3xl'>Mont'e Prama</h1>
					<form
						className='space-y-4'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								placeholder='nome@esempio.it'
								type='email'
								{...register('email')}
							/>
							{errors.email && (
								<p className='text-destructive text-sm'>
									{errors.email.message}
								</p>
							)}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								placeholder='Password'
								type='password'
								{...register('password')}
							/>
							{errors.password && (
								<p className='text-destructive text-sm'>
									{errors.password.message}
								</p>
							)}
						</div>
						<Button
							className='w-full'
							disabled={isLoading}
							type='submit'
						>
							{isLoading ? 'Accesso in corso...' : 'Accedi'}
						</Button>
					</form>
				</div>
			</div>
			<div className='hidden flex-1 bg-muted lg:block' />
		</div>
	)
}

export default LoginPage
