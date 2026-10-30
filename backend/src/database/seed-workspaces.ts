import 'dotenv/config';
import { db } from './db';
import { workspaces, users } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  try {
    const owner = await db.query.users.findFirst({
      where: eq(users.email, 'sarath@example.com'),
    });

    if (!owner) {
      console.log('Owner sarath@example.com not found');
      return;
    }

    // Update existing Abu Dhabi workspace with an image
    await db
      .update(workspaces)
      .set({
        imageUrl:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      })
      .where(eq(workspaces.name, 'Downtown WorkHub 2.0'));

    // Check count
    const existing = await db.select().from(workspaces);
    if (existing.length < 4) {
      await db.insert(workspaces).values([
        {
          ownerId: owner.id,
          name: 'Skyline Innovation Loft',
          description:
            'Panoramic skyline views with ergonomic standing desks, ultra-fast fiber internet, and artisan coffee bar.',
          address: '450 Silicon Avenue, Floor 14',
          city: 'San Francisco',
          country: 'USA',
          amenities: ['High-Speed Wi-Fi', 'Coffee & Tea', 'Meeting Rooms', 'Standing Desks', 'Phone Booths'],
          imageUrl:
            'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
          isActive: true,
        },
        {
          ownerId: owner.id,
          name: 'The Soho Creative Studio',
          description:
            'Chic industrial workspace designed for creative teams, freelancers, and innovators in the heart of London.',
          address: '18 Dean Street, Soho',
          city: 'London',
          country: 'UK',
          amenities: ['High-Speed Wi-Fi', 'Coffee & Tea', 'Podcast Studio', '24/7 Access', 'Event Space'],
          imageUrl:
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
          isActive: true,
        },
        {
          ownerId: owner.id,
          name: 'Cyberport Executive Suites',
          description:
            'Premium soundproof private offices and open collaborative lounges overlooking Tokyo Bay.',
          address: '2-11-1 Roppongi Hills',
          city: 'Tokyo',
          country: 'Japan',
          amenities: ['High-Speed Wi-Fi', 'Executive Boardroom', 'Parking', 'Coffee & Tea', 'Printing Services'],
          imageUrl:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
          isActive: true,
        },
      ]);
      console.log('Sample workspaces added! ✅');
    } else {
      console.log('Workspaces already seeded ✅');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
