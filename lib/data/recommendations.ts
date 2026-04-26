import type { Recommendation } from '@/lib/data/types'

export const recommendations: Recommendation[] = [
  {
    id: 'power-carbon-switching',
    priority: 'HIGH',
    title: 'Accelerate coal unit retirement and dispatch switching',
    description:
      'Prioritize coal-to-renewables and coal-to-gas replacement in high-emitting fleets, supported by unit-level dispatch optimization and storage-backed reliability planning.',
    potentialReductionPct: 18,
    sector: 'Power Plants',
    tags: ['fuel switching', 'renewables', 'dispatch optimization'],
  },
  {
    id: 'chemicals-process-heat',
    priority: 'HIGH',
    title: 'Electrify process heat and tighten steam systems',
    description:
      'Target chemical sites with high thermal loads for electric boilers, heat recovery, and steam leak reduction to cut combustion-related emissions without waiting for greenfield rebuilds.',
    potentialReductionPct: 11,
    sector: 'Chemicals',
    tags: ['process heat', 'electrification', 'heat recovery'],
  },
  {
    id: 'petroleum-methane',
    priority: 'HIGH',
    title: 'Reduce methane through leak detection and compressor upgrades',
    description:
      'Deploy continuous monitoring, rapid leak repair, and low-bleed pneumatic replacements across upstream and midstream assets to reduce high-intensity methane releases.',
    potentialReductionPct: 14,
    sector: 'Petroleum & Gas',
    tags: ['methane', 'LDAR', 'compressors'],
  },
  {
    id: 'minerals-kiln-efficiency',
    priority: 'MEDIUM',
    title: 'Improve kiln efficiency and clinker substitution',
    description:
      'Use alternative binders, higher supplementary cementitious material ratios, and kiln controls to cut both fuel combustion and process emissions in minerals facilities.',
    potentialReductionPct: 9,
    sector: 'Minerals',
    tags: ['kilns', 'clinker', 'efficiency'],
  },
  {
    id: 'waste-landfill-gas',
    priority: 'HIGH',
    title: 'Expand landfill gas capture and beneficial reuse',
    description:
      'Increase wellfield coverage, improve flare uptime, and route captured gas into RNG or on-site power generation to reduce fugitive methane from waste operations.',
    potentialReductionPct: 13,
    sector: 'Waste',
    tags: ['landfill gas', 'methane capture', 'RNG'],
  },
  {
    id: 'metals-furnace-efficiency',
    priority: 'MEDIUM',
    title: 'Upgrade furnaces and increase recycled feedstock share',
    description:
      'Modernize furnaces, recover waste heat, and shift toward recycled inputs where possible to lower energy intensity in primary and secondary metals production.',
    potentialReductionPct: 8,
    sector: 'Metals',
    tags: ['furnaces', 'scrap', 'waste heat'],
  },
  {
    id: 'refineries-hydrogen-optimization',
    priority: 'MEDIUM',
    title: 'Optimize hydrogen production and refinery fuel gas systems',
    description:
      'Reduce refinery emissions through hydrogen network balancing, fired-heater tuning, and flare minimization programs focused on large combustion sources.',
    potentialReductionPct: 7,
    sector: 'Refineries',
    tags: ['hydrogen', 'flare reduction', 'heater efficiency'],
  },
  {
    id: 'other-cross-sector-controls',
    priority: 'LOW',
    title: 'Standardize enterprise energy management controls',
    description:
      'Apply cross-sector metering, controls, and maintenance programs to smaller or mixed-source facilities where emissions reductions come from operational discipline.',
    potentialReductionPct: 6,
    sector: 'Other',
    tags: ['energy management', 'controls', 'operations'],
  },
]
