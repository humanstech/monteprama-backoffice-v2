import { create } from 'zustand'
import type { FlowStep } from '../types'

interface PoiStoreState {
	selectedLanguage: string
	isBozza: boolean
	flowStep: FlowStep
}

interface PoiStoreActions {
	setLanguage: (lang: string) => void
	setIsBozza: (bozza: boolean) => void
	setFlowStep: (step: FlowStep) => void
	reset: () => void
}

export const usePoiStore = create<PoiStoreState & PoiStoreActions>()((set) => ({
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
}))
