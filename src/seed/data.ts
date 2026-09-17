/** Content inventory transcribed from the audit doc (§3–4). Dates are best-guess month
 * placeholders where the source only gave a year — editors correct exact dates in /admin. */

function iso(year: number, month = 1) {
  return new Date(Date.UTC(year, month - 1, 1)).toISOString()
}

export const services = [
  {
    slug: 'data-centre-critical-system',
    title: 'Data Centre & Critical System',
    shortDescription: "We don't just build data centres — we run them.",
    order: 1,
  },
  {
    slug: 'ht-lv-cabling-works-genset-switchgear-and-transformer',
    title: 'HT & LV Electrical Supply, Fire Protection, ACMV, BMS & Security System',
    shortDescription: 'High Tension and Low Voltage power, switchgear, transformers, generators, ACMV, BMS, security and fire protection.',
    order: 2,
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    shortDescription: 'Comprehensive and well-coordinated project execution services tailored for infrastructure and electrical works.',
    order: 3,
  },
  {
    slug: 'facilities-management',
    title: 'Facilities Management',
    shortDescription: 'Reliable. Secure. Always On.',
    order: 4,
  },
  {
    slug: 'dfma-design-fabrication-of-modular-assemblies',
    title: 'DFMA — Design & Fabrication of Modular Assemblies',
    shortDescription: 'Modular design, fabrication, prototyping, and integration.',
    order: 5,
  },
]

type ProjectSeed = {
  slug: string
  title: string
  projectStatus: 'ongoing' | 'completed'
  location: string
  commencementDate?: string
  completionDate?: string
}

export const projects: ProjectSeed[] = [
  { slug: 'tm-nxera', title: 'TM Nxera', projectStatus: 'ongoing', location: 'Johor', commencementDate: iso(2025, 9), completionDate: iso(2026, 9) },
  { slug: 'ipdc-block-2', title: 'IPDC 2', projectStatus: 'completed', location: 'Johor', commencementDate: iso(2024, 10), completionDate: iso(2025, 10) },
  { slug: 'tm-brickfields', title: 'TM Brickfields', projectStatus: 'completed', location: 'Kuala Lumpur', commencementDate: iso(2025, 2), completionDate: iso(2025, 9) },
  { slug: 'bangunan-aims', title: 'Bangunan Aims', projectStatus: 'completed', location: 'Kuala Lumpur', commencementDate: iso(2025, 1), completionDate: iso(2025, 9) },
  { slug: 'aims-abt4', title: 'AIMS 132KV', projectStatus: 'completed', location: 'Cyberjaya', commencementDate: iso(2024, 6), completionDate: iso(2025, 7) },
  { slug: 'aims-abt3', title: 'AIMS Block 3', projectStatus: 'completed', location: 'Cyberjaya', commencementDate: iso(2024, 6), completionDate: iso(2025, 5) },
  { slug: 'aims-block-1-2-3', title: 'AIMS Block 1 & 2', projectStatus: 'completed', location: 'Cyberjaya', commencementDate: iso(2019, 1), completionDate: iso(2025, 2) },
  { slug: 'aims-data-center-appa', title: 'Bangunan Aims', projectStatus: 'completed', location: 'Kuala Lumpur', commencementDate: iso(2023, 2), completionDate: iso(2024, 1) },
  { slug: 'air-trunk-jhb1', title: 'Air Trunk DC', projectStatus: 'completed', location: 'Johor', commencementDate: iso(2023, 1), completionDate: iso(2023, 12) },
  { slug: 'ipdc-ip11', title: 'IPDC', projectStatus: 'completed', location: 'Johor', commencementDate: iso(2022, 8), completionDate: iso(2022, 12) },
  { slug: 'u-mobile-sdn-bhd', title: 'U Mobile Data Centre', projectStatus: 'completed', location: 'Malaysia', completionDate: iso(2020, 7) },
  { slug: 'menara-aims', title: 'Menara AIMS', projectStatus: 'completed', location: 'Kuala Lumpur', commencementDate: iso(2017, 7), completionDate: iso(2020, 1) },
  { slug: 'cls-cherating', title: 'CLS Cherating', projectStatus: 'completed', location: 'Kuantan', commencementDate: iso(2019, 8), completionDate: iso(2019, 12) },
  { slug: 'epcc-gas-district-cooling', title: 'EPCC, Gas District Cooling', projectStatus: 'completed', location: 'Putrajaya', commencementDate: iso(2018, 4), completionDate: iso(2018, 8) },
  { slug: 'spff-parcel-f', title: 'SPFF Parcel F', projectStatus: 'completed', location: 'Putrajaya', commencementDate: iso(2017, 1), completionDate: iso(2018, 12) },
  { slug: 'itrx', title: 'ITRX', projectStatus: 'completed', location: 'Kuala Lumpur', commencementDate: iso(2015, 1), completionDate: iso(2017, 12) },
  { slug: 'four-season-place', title: 'Four Season Place', projectStatus: 'completed', location: 'Kuala Lumpur', commencementDate: iso(2015, 1), completionDate: iso(2017, 12) },
  { slug: 'time-dot-com', title: 'TIME DOT COM', projectStatus: 'completed', location: 'Pulau Pinang', commencementDate: iso(2015, 4), completionDate: iso(2016, 12) },
  { slug: 'wisma-celcom-jalan-kemajuan-mhs2', title: 'Wisma Celcom, Jalan Kemajuan', projectStatus: 'completed', location: 'Malaysia', commencementDate: iso(2016, 1), completionDate: iso(2016, 6) },
  { slug: 'time-dot-com-2', title: 'TIME DOT COM', projectStatus: 'completed', location: 'Kuantan', commencementDate: iso(2013, 12), completionDate: iso(2014, 10) },
  { slug: 'marina-bs-tower-3', title: 'Marina BS Tower 3', projectStatus: 'completed', location: 'Singapore', commencementDate: iso(2007, 1), completionDate: iso(2011, 12) },
  { slug: 'tesco-data-centre', title: 'Tesco Data Centre', projectStatus: 'completed', location: 'Kepong', commencementDate: iso(2010, 7), completionDate: iso(2010, 8) },
]

export const milestones = [
  { year: '1997', title: 'Company Founded' },
  { year: '2007-2011', title: 'Regional Expansion' },
  { year: '2010-2011', title: 'Key Data Centre Delivery' },
  { year: '2013-2014', title: 'Telco Infrastructure Growth' },
  { year: '2015-2016', title: 'Continued Telco Projects' },
  { year: '2015-2017', title: 'Commercial Portfolio Growth' },
  { year: '2017-2020', title: 'Landmark Data Centre Projects' },
  { year: '2019', title: 'ISO Certifications' },
  { year: '2019-2022', title: 'AIMS Data Centre Programme' },
  { year: '2022-2023', title: 'Continued Data Centre Delivery' },
  { year: '2023', title: 'Hyperscale Client Wins' },
  { year: '2023-2025', title: 'Portfolio Expansion' },
  { year: '2025-2026', title: 'Ongoing Major Projects' },
  { year: '2025-and-beyond', title: 'Looking Ahead' },
].map((m, i) => ({ ...m, order: i, description: 'Details to be confirmed by IT Usaha Engineering.' }))

export const eventCategories = [
  { slug: 'annual-dinner', name: 'Annual Dinner' },
  { slug: 'company-award-ceremony', name: 'Company Award Ceremony' },
  { slug: 'company-trip', name: 'Company Trip' },
  { slug: 'csr-activities', name: 'CSR Activities' },
  { slug: 'recreational', name: 'Recreational' },
  { slug: 'team-building', name: 'Team Building' },
]

export const events = [
  { slug: 'award-ceremony-2026', title: 'Award Ceremony 2026', category: 'company-award-ceremony', eventDate: iso(2026, 1) },
  { slug: 'award-ceremony-2024', title: 'Award Ceremony 2024', category: 'company-award-ceremony', eventDate: iso(2024, 1) },
  { slug: 'award-ceremony-2023', title: 'Award Ceremony 2023', category: 'company-award-ceremony', eventDate: iso(2023, 1) },
  { slug: 'cny-annual-dinner-2026', title: 'CNY Annual Dinner 2026', category: 'annual-dinner', eventDate: iso(2026, 2) },
  { slug: 'cny-annual-dinner-2025', title: 'CNY Annual Dinner 2025', category: 'annual-dinner', eventDate: iso(2025, 2) },
  { slug: 'team-building-2025-melaka', title: 'Team Building 2025 (Melaka)', category: 'team-building', eventDate: iso(2025, 6) },
  { slug: 'team-building-2024-port-dickson', title: 'Team Building 2024 (Port Dickson)', category: 'team-building', eventDate: iso(2024, 6) },
  { slug: 'bowling-challenge', title: 'Bowling Challenge', category: 'recreational', eventDate: iso(2024, 9) },
  { slug: 'company-trip-2026-kunming-dali-lijiang', title: 'Company Trip 2026 (Kunming, Dali & Lijiang)', category: 'company-trip', eventDate: iso(2026, 4) },
  { slug: 'company-trip-2024-korea', title: 'Company Trip 2024 (Korea)', category: 'company-trip', eventDate: iso(2024, 4) },
  { slug: 'food-donation-drive-2026', title: 'Food Donation Drive 2026', category: 'csr-activities', eventDate: iso(2026, 3) },
]

export const jobPositions = [
  { slug: 'project-engineer-mechanical-electrical', title: 'Project Engineer (Mechanical / Electrical)', location: 'Klang Valley' },
  { slug: 'hr-admin-executive', title: 'HR & Admin Executive', location: 'Klang Valley' },
  { slug: 'account-executive', title: 'Account Executive', location: 'Klang Valley' },
  { slug: 'purchasing-assistant', title: 'Purchasing Assistant', location: 'Klang Valley' },
  { slug: 'bim-modeler-senior-junior', title: 'BIM Modeler (Senior / Junior)', location: 'Klang Valley / Johor' },
  { slug: 'deputy-project-manager-project-manager', title: 'Deputy Project Manager / Project Manager', location: 'Klang Valley / Johor' },
]
