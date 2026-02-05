const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@deal.lk' },
        update: {},
        create: {
            email: 'admin@deal.lk',
            name: 'Super Admin',
            password: password,
            role: 'ADMIN',
        },
    });

    console.log({ user });

    // Seed Categories
    const categories = ['Vehicles', 'Electronics', 'Property', 'Jobs', 'Fashion', 'Home & Garden', 'Sports', 'Services'];
    const categoryRecords = [];
    for (const name of categories) {
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, icon: 'Circle' },
        });
        categoryRecords.push(cat);
    }

    // Seed Locations
    const locations = [
        { district: 'Colombo', city: 'Colombo 1' },
        { district: 'Colombo', city: 'Nugegoda' },
        { district: 'Kandy', city: 'Kandy City' },
        { district: 'Galle', city: 'Galle Fort' },
        { district: 'Gampaha', city: 'Negombo' },
        { district: 'Kurunegala', city: 'Kurunegala Town' }
    ];
    const locationRecords = [];
    for (const loc of locations) {
        const l = await prisma.location.upsert({
            where: { district_city: { district: loc.district, city: loc.city } },
            update: {},
            create: { district: loc.district, city: loc.city },
        });
        locationRecords.push(l);
    }

    // Seed 100 Dummy Ads
    console.log('Seeding 100 dummy ads...');
    const images = [
        "https://images.unsplash.com/photo-1594502184342-28f3790f4024?q=80&w=2670&auto=format&fit=crop", // Car
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop", // Land
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop", // Phone
        "https://images.unsplash.com/photo-1550009158-9ebf6917f92e?q=80&w=2000&auto=format&fit=crop", // Electronics
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2000&auto=format&fit=crop", // Shoes
    ];

    const titles = [
        "Brand New Condition", "Urgent Sale", "Best Price in Town", "Limited Offer", "High Quality Item",
        "Used for 2 months", "Unwanted Gift", "Moving Abroad Sale", "Genuine Product", "Factory Sealed"
    ];

    for (let i = 0; i < 100; i++) {
        const randomCategory = categoryRecords[Math.floor(Math.random() * categoryRecords.length)];
        const randomLocation = locationRecords[Math.floor(Math.random() * locationRecords.length)];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const randomTitleSuffix = titles[Math.floor(Math.random() * titles.length)];

        await prisma.ad.create({
            data: {
                title: `${randomCategory.name} - ${randomTitleSuffix} ${i + 1}`,
                description: `This is a sample description for ad number ${i + 1}. Great condition, barely used. Contact for more details.`,
                price: Math.floor(Math.random() * 100000) + 1000,
                images: JSON.stringify([randomImage]),
                status: 'APPROVED',
                featured: Math.random() < 0.1, // 10% chance of being featured
                userId: user.id,
                categoryId: randomCategory.id,
                locationId: randomLocation.id,
            }
        });
    }
    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
