import type { Workspace } from '../types';

// Curated high-resolution architectural photography of real workspaces
const REAL_WORKSPACE_PHOTOS = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
];

const SPACE_TYPES = [
  'Private Office',
  'Meeting Room',
  'Creative Loft',
  'Dedicated Desk',
  'Podcast Studio',
  'Boardroom Suite',
];

const HOST_NAMES = [
  'Elena Rostova',
  'Studio Collective',
  'Marcus & Clara',
  'Foundry Labs',
  'Apex Workspaces',
  'Nordic Spaces',
];

// Simple deterministic hash based on ID or name
function getDeterministicIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

// Enrich a workspace with realistic marketplace attributes
export function enrichWorkspace(w: Workspace): Workspace {
  const seed = w.id || w.name || 'workspace-seed';
  const typeIndex = getDeterministicIndex(seed, SPACE_TYPES.length);
  const hostIndex = getDeterministicIndex(seed + 'host', HOST_NAMES.length);
  const photoIndex = getDeterministicIndex(seed + 'photo', REAL_WORKSPACE_PHOTOS.length);
  const basePrice = 30 + (getDeterministicIndex(seed + 'price', 14) * 5); // $30 - $95 / hr
  const rating = 4.80 + (getDeterministicIndex(seed + 'rating', 20) * 0.01); // 4.80 - 4.99
  const reviewCount = 14 + getDeterministicIndex(seed + 'reviews', 120);
  const capacity = 4 + (getDeterministicIndex(seed + 'cap', 8) * 3); // 4 to 28 guests

  return {
    ...w,
    imageUrl: w.imageUrl || REAL_WORKSPACE_PHOTOS[photoIndex],
    pricePerHour: w.pricePerHour || basePrice,
    rating: w.rating || Number(rating.toFixed(2)),
    reviewCount: w.reviewCount || reviewCount,
    capacity: w.capacity || capacity,
    spaceType: w.spaceType || SPACE_TYPES[typeIndex],
    isSuperhost: w.isSuperhost ?? (reviewCount > 30),
    hostName: w.hostName || HOST_NAMES[hostIndex],
    responseTime: w.responseTime || 'Responds in under 15 min',
    instantBook: w.instantBook ?? (basePrice % 2 === 0),
  };
}

// Fallback high-quality curated spaces in case backend is empty or seeding hasn't run
export const CURATED_FALLBACK_SPACES: Workspace[] = [
  {
    id: 'ws-curated-1',
    ownerId: 'owner-sarath',
    name: 'The Foundry Industrial Loft & Boardroom',
    description:
      'Sunlit timber & brick open warehouse with ergonomic Herman Miller seating, dual 4K wireless presentation displays, and an artisan espresso bar.',
    address: '142 Commercial St, Shoreditch',
    city: 'London',
    country: 'United Kingdom',
    amenities: [
      'High-Speed Wi-Fi',
      'Artisan Coffee & Tea',
      '4K Presentation Screens',
      'Ergonomic Seating',
      'Phone Booths',
      'Bike Storage',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    pricePerHour: 45,
    rating: 4.96,
    reviewCount: 68,
    capacity: 16,
    spaceType: 'Creative Loft',
    isSuperhost: true,
    hostName: 'Studio Collective',
    responseTime: 'Responds within 10 min',
    instantBook: true,
  },
  {
    id: 'ws-curated-2',
    ownerId: 'owner-sarath',
    name: 'Skyline Innovation Suite & Terrace',
    description:
      'Panoramic 180° views of the Bay, soundproof acoustic paneling, motorized standing desks, and executive videoconference equipment.',
    address: '450 Silicon Avenue, Floor 14',
    city: 'San Francisco',
    country: 'United States',
    amenities: [
      '1 Gbps Fiber Wi-Fi',
      'Conference Bar & Cameras',
      'Motorized Standing Desks',
      'Rooftop Terrace',
      'Catering Available',
      '24/7 Access',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    pricePerHour: 75,
    rating: 4.98,
    reviewCount: 94,
    capacity: 12,
    spaceType: 'Executive Suite',
    isSuperhost: true,
    hostName: 'Apex Workspaces',
    responseTime: 'Responds within 5 min',
    instantBook: true,
  },
  {
    id: 'ws-curated-3',
    ownerId: 'owner-sarath',
    name: 'Atelier Botanica Daylight Studio',
    description:
      'Warm natural light daylight studio filled with lush indoor greenery, natural oak conference tables, and a dedicated podcast recording booth.',
    address: '28 Oranienstraße, Kreuzberg',
    city: 'Berlin',
    country: 'Germany',
    amenities: [
      'High-Speed Wi-Fi',
      'Podcast Recording Booth',
      'Natural Daylight',
      'Tea & Matcha Bar',
      'Pet Friendly',
      'Whiteboards',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    pricePerHour: 55,
    rating: 4.92,
    reviewCount: 41,
    capacity: 10,
    spaceType: 'Creative Studio',
    isSuperhost: true,
    hostName: 'Elena Rostova',
    responseTime: 'Responds within 20 min',
    instantBook: false,
  },
  {
    id: 'ws-curated-4',
    ownerId: 'owner-sarath',
    name: 'The Williamsburg Roastery & Co-Lab',
    description:
      'Bustling yet productive community hub with specialty cold brew on tap, private soundproof phone cabins, and outdoor garden patio.',
    address: '88 North 6th Street, Brooklyn',
    city: 'New York',
    country: 'United States',
    amenities: [
      'High-Speed Wi-Fi',
      'Cold Brew on Tap',
      'Soundproof Phone Cabins',
      'Garden Patio',
      'Printing Station',
      'Event Ready',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    pricePerHour: 35,
    rating: 4.89,
    reviewCount: 112,
    capacity: 25,
    spaceType: 'Dedicated Desk',
    isSuperhost: false,
    hostName: 'Marcus & Clara',
    responseTime: 'Responds within 30 min',
    instantBook: true,
  },
  {
    id: 'ws-curated-5',
    ownerId: 'owner-sarath',
    name: 'Shibuya Glasshouse Focus Suites',
    description:
      'Minimalist Japanese acoustic design, ultra-quiet private cabins, dual 4K monitors, and authentic green tea service.',
    address: '1-14 Jinnan, Shibuya-ku',
    city: 'Tokyo',
    country: 'Japan',
    amenities: [
      'Ultra Quiet Zone',
      'Dual 4K Monitors',
      'Japanese Tea Bar',
      'Acoustic Cabins',
      'High-Speed Wi-Fi',
      'High Security',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    pricePerHour: 50,
    rating: 4.97,
    reviewCount: 53,
    capacity: 8,
    spaceType: 'Private Office',
    isSuperhost: true,
    hostName: 'Nordic Spaces',
    responseTime: 'Responds within 10 min',
    instantBook: true,
  },
  {
    id: 'ws-curated-6',
    ownerId: 'owner-sarath',
    name: 'Canal View Jordaan Penthouse Hub',
    description:
      'Historic canal-front building featuring double-height ceilings, exposed beams, modern breakout lounge, and waterside balcony.',
    address: '312 Prinsengracht, Jordaan',
    city: 'Amsterdam',
    country: 'Netherlands',
    amenities: [
      'High-Speed Wi-Fi',
      'Canal Balcony',
      'Breakout Lounge',
      'Kitchenette & Bar',
      'Smart TV Display',
      'Meeting Whiteboards',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    pricePerHour: 65,
    rating: 4.95,
    reviewCount: 37,
    capacity: 14,
    spaceType: 'Meeting Room',
    isSuperhost: true,
    hostName: 'Studio Collective',
    responseTime: 'Responds within 15 min',
    instantBook: true,
  },
];

