type ServiceModelState = {
  'data-centre': 'all' | 'power' | 'cooling' | 'protection' | 'controls'
  'electrical-services': 'normal' | 'backup'
  'project-management': 'structure' | 'equipment' | 'coordination' | 'commissioning'
  'facilities-management': 'neutral' | 'cooling' | 'electrical' | 'monitoring' | 'general'
  dfma: 'design' | 'fabrication' | 'transport' | 'installation'
}
export type ServiceId = keyof ServiceModelState
export type ModelId = ServiceId | 'server-rack' | 'company-logo' | 'homepage-campus'
type CameraPreset = {
  position: [number, number, number]
  target: [number, number, number]
  span: number
  mobileSpan: number
}
type ModelEntry = {
  url: string
  mobileUrl?: string
  poster: string
  defaultState: string
  states: { id: string; label: string; description: string; poster: string }[]
  camera?: CameraPreset
}
const directory = (id: string, file: string) => `/models/${id}/${file}`
function service(
  id: ServiceId,
  defaultState: string,
  camera: CameraPreset,
  states: [string, string, string, string][],
): ModelEntry {
  return {
    url: directory(id, `${id}.glb`),
    mobileUrl: directory(id, `${id}-mobile.glb`),
    poster: directory(id, `${id}-poster.webp`),
    defaultState,
    camera,
    states: states.map(([state, label, description, poster]) => ({
      id: state,
      label,
      description,
      poster: directory(id, poster),
    })),
  }
}
export const modelRegistry: Record<ModelId, ModelEntry> = {
  'server-rack': {
    url: '/models/server/server-rack.glb',
    poster: '/assets/logo.png',
    defaultState: 'default',
    states: [],
  },
  'company-logo': {
    url: '/models/logo/company-logo.glb',
    poster: '/assets/logo.png',
    defaultState: 'default',
    states: [],
  },
  'homepage-campus': {
    url: '/models/homepage-campus/homepage-campus.glb',
    poster: '/models/homepage-campus/homepage-campus-poster.webp',
    defaultState: 'default',
    states: [],
    camera: { position: [80, 86, 110], target: [0, 2, 0], span: 75, mobileSpan: 135 },
  },
  'data-centre': service(
    'data-centre',
    'all',
    { position: [13, 14, 18], target: [0, 1, -0.3], span: 13.65, mobileSpan: 20.11 },
    [
      ['all', 'All', 'All systems with the building architecture.', 'data-centre-poster.webp'],
      ...['Power', 'Cooling', 'Protection', 'Controls'].map(
        (label) =>
          [
            label.toLowerCase(),
            label,
            `${label} systems with the building architecture.`,
            `layer-${label.toLowerCase()}.webp`,
          ] as [string, string, string, string],
      ),
    ],
  ),
  'electrical-services': service(
    'electrical-services',
    'normal',
    { position: [12, 16, 19], target: [0, 1, 0], span: 15.333333, mobileSpan: 24 },
    [
      [
        'normal',
        'Normal supply',
        'The normal supply path is highlighted; all equipment remains visible.',
        'electrical-services-poster.webp',
      ],
      [
        'backup',
        'Backup supply',
        'The backup supply path is highlighted; all equipment remains visible.',
        'electrical-services-backup-poster.webp',
      ],
    ],
  ),
  'project-management': service(
    'project-management',
    'commissioning',
    { position: [13, 15, 19], target: [0, 1.2, 0], span: 16.133333, mobileSpan: 23 },
    [
      [
        'structure',
        'Structure',
        'Structural coordination and site readiness.',
        'stage-structure.webp',
      ],
      [
        'equipment',
        'Equipment',
        'Equipment placement and installation coordination.',
        'stage-equipment.webp',
      ],
      [
        'coordination',
        'Coordination',
        'MEP routing and interface coordination.',
        'stage-coordination.webp',
      ],
      [
        'commissioning',
        'Commissioning',
        'Inspection access and commissioning coordination.',
        'stage-commissioning.webp',
      ],
    ],
  ),
  'facilities-management': service(
    'facilities-management',
    'neutral',
    { position: [12, 14, 18], target: [0, 1, 0], span: 14.625, mobileSpan: 21 },
    [
      ['neutral', 'Overview', 'Neutral overview of the plant.', 'state-neutral.webp'],
      ['cooling', 'Cooling', 'Cooling service access and pipe fittings.', 'state-cooling.webp'],
      [
        'electrical',
        'Electrical',
        'Electrical enclosure inspection access.',
        'state-electrical.webp',
      ],
      ['monitoring', 'Monitoring', 'Monitoring device inspection.', 'state-monitoring.webp'],
      ['general', 'General', 'Floor access and maintenance circulation.', 'state-general.webp'],
    ],
  ),
  dfma: service(
    'dfma',
    'installation',
    { position: [10, 9, 13], target: [0, 1.5, 0], span: 9.6, mobileSpan: 12.8 },
    [
      [
        'design',
        'Design',
        'Module frame and interfaces in the assembled position.',
        'stage-design.webp',
      ],
      [
        'fabrication',
        'Fabrication',
        'Exploded view of the module components.',
        'stage-fabrication.webp',
      ],
      [
        'transport',
        'Transport',
        'Assembled module with transport preparation geometry.',
        'stage-transport.webp',
      ],
      [
        'installation',
        'Installation',
        'Assembled module with transport preparation removed.',
        'stage-installation.webp',
      ],
    ],
  ),
}
export function modelPoster(id: ModelId, state: string) {
  return (
    modelRegistry[id].states.find((item) => item.id === state)?.poster ?? modelRegistry[id].poster
  )
}
