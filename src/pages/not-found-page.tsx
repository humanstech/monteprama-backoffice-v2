import { Link } from 'react-router'

function NotFoundPage() {
	return (
		<div className='flex flex-1 flex-col items-center justify-center gap-4 text-center'>
			<h1 className='font-bold text-6xl text-muted-foreground'>404</h1>
			<p className='text-muted-foreground text-xl'>Pagina non trovata</p>
			<p className='text-muted-foreground text-sm'>
				La pagina che stai cercando non esiste o è stata spostata.
			</p>
			<Link
				className='mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90'
				to='/'
			>
				Torna alla home
			</Link>
		</div>
	)
}

export default NotFoundPage
