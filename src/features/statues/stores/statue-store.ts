import { create } from 'zustand'
import type { FlowStep } from '@/features/poi/types'

interface StatueStoreState {
	selectedLanguage: string
	isBozza: boolean
	flowStep: FlowStep
}

interface StatueStoreActions {
	setLanguage: (lang: string) => void
	setIsBozza: (bozza: boolean) => void
	setFlowStep: (step: FlowStep) => void
	reset: () => void
}

export const useStatueStore = create<StatueStoreState & StatueStoreActions>()(
	(set) => ({
		selectedLanguage: 'Italiano',
		isBozza: true,
		flowStep: 'textAndMedia',
		setLanguage: (lang) => set({ selectedLanguage: lang }),
		setIsBozza: (bozza) => set({ isBozza: bozza }),
		setFlowStep: (step) => set({ flowStep: step }),
		reset: () =>
			set({
				selectedLanguage: 'Italiano',
				isBozza: true,
				flowStep: 'textAndMedia'
			})
	})
)
