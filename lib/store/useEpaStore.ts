import { create } from 'zustand'
import type { EpaDataset, SectorName } from '@/lib/data/types'

export interface EpaStore {
  activeYear: number
  activeSector: SectorName | null
  activeState: string | null
  uploadedData: EpaDataset | null
  setActiveYear: (year: number) => void
  setActiveSector: (sector: SectorName | null) => void
  setActiveState: (state: string | null) => void
  setUploadedData: (data: EpaDataset) => void
  clearUploadedData: () => void
}

export const useEpaStore = create<EpaStore>((set) => ({
  activeYear: 2023,
  activeSector: null,
  activeState: null,
  uploadedData: null,
  setActiveYear: (activeYear) => set({ activeYear }),
  setActiveSector: (activeSector) => set({ activeSector }),
  setActiveState: (activeState) => set({ activeState }),
  setUploadedData: (uploadedData) => set({ uploadedData }),
  clearUploadedData: () => set({ uploadedData: null }),
}))
