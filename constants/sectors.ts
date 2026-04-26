import type { SectorName } from '@/lib/data/types'

export interface SectorMeta {
  name: SectorName
  icon: string
  description: string
}

export const sectors: SectorMeta[] = [
  {
    name: 'Power Plants',
    icon: 'Zap',
    description: 'Utility-scale electricity generation and combustion-heavy power assets.',
  },
  {
    name: 'Chemicals',
    icon: 'FlaskConical',
    description: 'Chemical manufacturing facilities with process heat and feedstock emissions.',
  },
  {
    name: 'Petroleum & Gas',
    icon: 'Fuel',
    description: 'Upstream, gathering, and gas system emissions with strong methane exposure.',
  },
  {
    name: 'Minerals',
    icon: 'Mountain',
    description: 'Cement, lime, and mineral processing sources with kiln-driven process emissions.',
  },
  {
    name: 'Waste',
    icon: 'Trash2',
    description: 'Landfills and waste systems where methane capture performance drives outcomes.',
  },
  {
    name: 'Metals',
    icon: 'Anvil',
    description: 'Primary and secondary metals production with high-temperature furnace demand.',
  },
  {
    name: 'Refineries',
    icon: 'Factory',
    description: 'Refining operations with heater, hydrogen, and flare-related combustion loads.',
  },
  {
    name: 'Other',
    icon: 'Layers3',
    description: 'Mixed industrial sources grouped outside the primary GHGRP sector buckets.',
  },
]
