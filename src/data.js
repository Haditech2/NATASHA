export const LGAS = [
  {
    name: 'Adavi',
    wards: ['Adavi-Eba', 'Ege', 'Idanuhua', 'Ikaro', 'Inoziomi', 'Kuroko I', 'Kuroko II', 'Nagazi', 'Ogaminana Central', 'Okunchi/Ozuri/Onieka', 'Osisi'],
    seedCount: 516,
  },
  {
    name: 'Ajaokuta',
    wards: ['Ajaokuta Township', 'Adogo', 'Badoko', 'Ebiya North', 'Ebiya South', 'Ganaja', 'Ichuwa/Upaja', 'Obangede/Uhuodo', 'Odonu/Unosi', 'Ogigiri', 'Old Ajaokuta', 'Omgbo', 'Oworo'],
    seedCount: 487,
  },
  {
    name: 'Okehi',
    wards: ['Eika/Ohizenyi', 'Obangede/Uhuodo', 'Oboroke Eba', 'Oboroke Uvete', 'Ohuepe/Omavi', 'Ohuepe/Osara', 'Okaito/Usungwe', 'Ohueta', 'Okehi', 'Upogoro/Odenku'],
    seedCount: 503,
  },
  {
    name: 'Okene',
    wards: ['Abuga/Ozuja', 'Bariki', 'Idoji', 'Obehira Eba', 'Obehira Uvete', 'Obessa', 'Okene-Eba/Agassa/Ahache', 'Onyukoko', 'Orietesu', 'Otutu', 'Upogoro/Odenku'],
    seedCount: 564,
  },
  {
    name: 'Ogori-Magongo',
    wards: ['Aiyeromi', 'Eni', 'Ileteju', 'Obinoyin', 'Obatgben', 'Oturu Opowuroye', 'Ugugu', 'Okibo'],
    seedCount: 349,
  },
]

export const BASE_POSTER_COUNT = LGAS.reduce((sum, lga) => sum + lga.seedCount, 0)

export const IMAGE_PATHS = {
  traditionalChair: '/images/natasha-traditional-chair.jpg',
  navyPortrait: '/images/natasha-navy-portrait.jpg',
  rally: '/images/natasha-rally.jpg',
  traditionalFront: '/images/natasha-traditional-front.jpg',
  campaignPoster: '/images/natasha-campaign-poster.jpg',
  template: '/images/natasha-poster-template.jpg',
}

export const SUPPORTER_SAMPLES = [
  { id: 'sample-1', name: 'Kogi Central Supporter', lga: 'Okene', ward: 'Okene-Eba', image: IMAGE_PATHS.campaignPoster, quote: 'Service you can see, progress we can build upon.' },
  { id: 'sample-2', name: 'Women for Natasha', lga: 'Okehi', ward: 'Oboroke', image: IMAGE_PATHS.traditionalChair, quote: 'Standing for inclusive representation and stronger communities.' },
  { id: 'sample-3', name: 'Youth for Progress', lga: 'Adavi', ward: 'Ogaminana', image: IMAGE_PATHS.navyPortrait, quote: 'A future shaped by opportunity, education and accountable service.' },
  { id: 'sample-4', name: 'Grassroots Movement', lga: 'Ajaokuta', ward: 'Ajaokuta Township', image: IMAGE_PATHS.rally, quote: 'Together, every voice and every community matters.' },
  { id: 'sample-5', name: 'Kogi Central Women', lga: 'Ogori-Magongo', ward: 'Ogori', image: IMAGE_PATHS.traditionalFront, quote: 'Representation that sees us, hears us and works for us.' },
  { id: 'sample-6', name: 'Progress Coalition', lga: 'Okene', ward: 'Bariki', image: IMAGE_PATHS.campaignPoster, quote: 'Continuity, courage and visible impact across Kogi Central.' },
  { id: 'sample-7', name: 'Community Volunteers', lga: 'Okehi', ward: 'Eika', image: IMAGE_PATHS.rally, quote: 'Five LGAs, one shared vision for sustainable development.' },
  { id: 'sample-8', name: 'Students for Natasha', lga: 'Adavi', ward: 'Nagazi', image: IMAGE_PATHS.navyPortrait, quote: 'Better learning, digital access and brighter futures.' },
  { id: 'sample-9', name: 'Ajaokuta Progressives', lga: 'Ajaokuta', ward: 'Adogo', image: IMAGE_PATHS.traditionalChair, quote: 'Ajaokuta can work, and Kogi Central can thrive.' },
  { id: 'sample-10', name: 'Ogori-Magongo Network', lga: 'Ogori-Magongo', ward: 'Magongo', image: IMAGE_PATHS.traditionalFront, quote: 'Development that reaches every ward and every family.' },
]

export const PRIORITIES = [
  { title: 'Quality education', detail: 'Brighter futures through modern schools, scholarships and digital learning.' },
  { title: 'Better healthcare', detail: 'Accessible facilities, medical equipment and healthier families.' },
  { title: 'Infrastructure', detail: 'Water, roads, energy and connectivity for stronger communities.' },
  { title: 'Youth & women', detail: 'Skills, enterprise support and sustainable economic opportunity.' },
]
