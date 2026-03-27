const JOB_STATUS_LABELS: Record<string, { text: string; className: string }> = {
	not_started: {
		text: 'Non avviato',
		className: 'bg-muted text-muted-foreground'
	},
	in_progress: {
		text: 'In corso',
		className:
			'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
	},
	processing: {
		text: 'In elaborazione',
		className:
			'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
	},
	completed: {
		text: 'Completato',
		className:
			'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
	},
	failed: {
		text: 'Errore',
		className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
	}
}

function JobBadge({
	label,
	status
}: {
	label: string
	status?: string | null
}) {
	if (!status || status === 'not_started') {
		return null
	}
	const config = JOB_STATUS_LABELS[status] ?? {
		text: status,
		className: 'bg-muted text-muted-foreground'
	}
	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px] ${config.className}`}
		>
			{label}: {config.text}
		</span>
	)
}

export { JobBadge }
