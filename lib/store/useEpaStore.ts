import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EpaDataset, SectorName } from '@/lib/data/types'

export interface EpaStore {
  activeYear: number
  activeSector: SectorName | null
  activeState: string | null
  selectedFacility: string | null
  uploadedData: EpaDataset | null
  setActiveYear: (year: number) => void
  setActiveSector: (sector: SectorName | null) => void
  setActiveState: (state: string | null) => void
  setSelectedFacility: (facility: string | null) => void
  setUploadedData: (data: EpaDataset) => void
  clearUploadedData: () => void
}

export const useEpaStore = create<EpaStore>()(
  persist(
    (set) => ({
      activeYear: 2023,
      activeSector: null,
      activeState: null,
      selectedFacility: null,
      uploadedData: null,
      setActiveYear: (activeYear) => set({ activeYear }),
      setActiveSector: (activeSector) => set({ activeSector }),
      setActiveState: (activeState) => set({ activeState }),
      setSelectedFacility: (selectedFacility) => set({ selectedFacility }),
      setUploadedData: (uploadedData) => set({ uploadedData }),
      clearUploadedData: () => set({ uploadedData: null }),
    }),
    {
      name: 'verdeon-ui-state',
      partialize: (state) => ({
        activeYear: state.activeYear,
        activeSector: state.activeSector,
        activeState: state.activeState,
        selectedFacility: state.selectedFacility,
      }),
    },
  ),
)
