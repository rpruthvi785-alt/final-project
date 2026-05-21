const Category = require('../models/Category');
const Event = require('../models/Event');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await Category.deleteMany({});
    await Event.deleteMany({});
    const adminUsers = [
      { name: 'Admin Master',  email: 'admin@traveltracker.com', password: 'Admin@2025', role: 'admin', profileImage: 'https://i.pravatar.cc/150?u=2' },
      { name: 'Aravind Swamy', email: 'aravind@explorer.com',    password: 'Admin@2025', role: 'admin', profileImage: 'https://i.pravatar.cc/150?u=1' },
    ];
    for (const adminData of adminUsers) {
      const existing = await User.findOne({ email: adminData.email });
      if (!existing) {
        await User.create(adminData);
        console.log(`✅ Created admin: ${adminData.email}`);
      } else {
        existing.password = adminData.password;
        await existing.save();
        console.log(`✅ Password reset for: ${adminData.email}`);
      }
    }

    const adventureCat = await Category.create({
      categoryName: 'Adventure Treks',
      categoryBannerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    });
    const beachCat = await Category.create({
      categoryName: 'Beach Getaways',
      categoryBannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    });
    const wildlifeCat = await Category.create({
      categoryName: 'Wildlife Safaris',
      categoryBannerImage: 'https://images.unsplash.com/photo-1474511320721-9a6ee0738356?auto=format&fit=crop&w=1200&q=80'
    });
    const culturalCat = await Category.create({
      categoryName: 'Cultural Immersions',
      categoryBannerImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
    });

    const oLogo = 'https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=crop&w=200&q=80';

    const eventsData = [
      {
        eventTitle: 'Chadar Frozen River Trek',
        eventSubtitle: 'Walking on Thin Ice',
        category: adventureCat._id,
        eventDate: new Date('2025-01-20'),
        city: 'Leh', country: 'India', venue: 'Chilling',
        suggestedDonation: 25000, estimatedTravelBudget: 85000,
        eventBanner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Himalayan Masters', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '9 Days', difficulty: 'Extreme',
        expenditure: { transport: 15000, accommodation: 20000, food: 12000, activities: 25000, permits: 8000, miscellaneous: 5000 }
      },
      {
        eventTitle: 'Spiti Valley Winter Expedition',
        eventSubtitle: 'The White Desert',
        category: adventureCat._id,
        eventDate: new Date('2025-02-10'),
        city: 'Kaza', country: 'India', venue: 'Shimla',
        suggestedDonation: 15000, estimatedTravelBudget: 45000,
        eventBanner: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Spiti Nomads', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '8 Days', difficulty: 'Extreme',
        expenditure: { transport: 12000, accommodation: 10000, food: 8000, activities: 10000, permits: 3000, miscellaneous: 2000 }
      },
      {
        eventTitle: 'Hampi Heritage & Bouldering',
        eventSubtitle: 'The Lost Empire',
        category: culturalCat._id,
        eventDate: new Date('2025-11-20'),
        city: 'Hampi', country: 'India', venue: 'Temple Square',
        suggestedDonation: 5000, estimatedTravelBudget: 22000,
        eventBanner: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1508919892451-4bc34ac31d0d?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Heritage Hikes', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '4 Days', difficulty: 'Moderate',
        expenditure: { transport: 4000, accommodation: 6000, food: 5000, activities: 4000, permits: 1000, miscellaneous: 2000 }
      },
      {
        eventTitle: 'Gokarna Beach Camping',
        eventSubtitle: 'Sun and Sand',
        category: beachCat._id,
        eventDate: new Date('2025-10-12'),
        city: 'Gokarna', country: 'India', venue: 'Kudle',
        suggestedDonation: 3500, estimatedTravelBudget: 12000,
        eventBanner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Coastal Roamers', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '2 Days', difficulty: 'Easy',
        expenditure: { transport: 2000, accommodation: 3000, food: 3000, activities: 2000, permits: 500, miscellaneous: 1500 }
      },
      {
        eventTitle: 'Kaziranga Rhino Safari',
        eventSubtitle: 'Assam Wilderness',
        category: wildlifeCat._id,
        eventDate: new Date('2025-03-05'),
        city: 'Kohora', country: 'India', venue: 'Main Range',
        suggestedDonation: 6000, estimatedTravelBudget: 32000,
        eventBanner: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Wild India', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '4 Days', difficulty: 'Moderate',
        expenditure: { transport: 8000, accommodation: 10000, food: 6000, activities: 5000, permits: 2000, miscellaneous: 1000 }
      },
      {
        eventTitle: 'Valley of Flowers Trek',
        eventSubtitle: 'The Alpine Paradise',
        category: adventureCat._id,
        eventDate: new Date('2025-07-15'),
        city: 'Joshimath', country: 'India', venue: 'Ghangaria',
        suggestedDonation: 12000, estimatedTravelBudget: 35000,
        eventBanner: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Himalayan Masters', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '6 Days', difficulty: 'Moderate',
        expenditure: { transport: 6000, accommodation: 8000, food: 7000, activities: 10000, permits: 2000, miscellaneous: 2000 }
      },
      {
        eventTitle: 'Rajasthan Desert Safari',
        eventSubtitle: 'The Golden Sands',
        category: adventureCat._id,
        eventDate: new Date('2025-12-05'),
        city: 'Jaisalmer', country: 'India', venue: 'Sam Dunes',
        suggestedDonation: 8000, estimatedTravelBudget: 28000,
        eventBanner: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1508919892451-4bc34ac31d0d?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Desert Nomads', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '4 Days', difficulty: 'Moderate',
        expenditure: { transport: 5000, accommodation: 9000, food: 6000, activities: 6000, permits: 1000, miscellaneous: 1000 }
      },
      {
        eventTitle: 'Andaman Scuba Expedition',
        eventSubtitle: 'Ocean Depths',
        category: beachCat._id,
        eventDate: new Date('2025-11-15'),
        city: 'Havelock', country: 'India', venue: 'Radhanagar',
        suggestedDonation: 15000, estimatedTravelBudget: 55000,
        eventBanner: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Coastal Roamers', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '5 Days', difficulty: 'Moderate',
        expenditure: { transport: 10000, accommodation: 15000, food: 10000, activities: 15000, permits: 3000, miscellaneous: 2000 }
      },
      {
        eventTitle: 'Kutch Rann Utsav',
        eventSubtitle: 'The White Desert Festival',
        category: culturalCat._id,
        eventDate: new Date('2025-12-10'),
        city: 'Bhuj', country: 'India', venue: 'Dhordo',
        suggestedDonation: 8500, estimatedTravelBudget: 30000,
        eventBanner: 'https://images.unsplash.com/photo-1542384701-c0e46e0eda04?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1542384701-c0e46e0eda04?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1542384701-c0e46e0eda04?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Desert Nomads', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '4 Days', difficulty: 'Easy',
        expenditure: { transport: 6000, accommodation: 12000, food: 6000, activities: 4000, permits: 1000, miscellaneous: 1000 }
      },
      {
        eventTitle: 'Coorg Coffee Estate Stay',
        eventSubtitle: 'Scotland of India',
        category: culturalCat._id,
        eventDate: new Date('2025-08-12'),
        city: 'Madikeri', country: 'India', venue: 'Coffee Hills',
        suggestedDonation: 5500, estimatedTravelBudget: 25000,
        eventBanner: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Heritage Hikes', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '3 Days', difficulty: 'Easy',
        expenditure: { transport: 4000, accommodation: 8000, food: 7000, activities: 4000, permits: 1000, miscellaneous: 1000 }
      },
      {
        eventTitle: 'Lakshadweep Coral Reefs',
        eventSubtitle: 'Pristine Island Getaway',
        category: beachCat._id,
        eventDate: new Date('2025-10-05'),
        city: 'Agatti', country: 'India', venue: 'Agatti Island',
        suggestedDonation: 12000, estimatedTravelBudget: 45000,
        eventBanner: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Coastal Roamers', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '5 Days', difficulty: 'Easy',
        expenditure: { transport: 15000, accommodation: 15000, food: 8000, activities: 5000, permits: 1000, miscellaneous: 1000 }
      },
      {
        eventTitle: 'Varanasi Spiritual Walk',
        eventSubtitle: 'Eternal City',
        category: culturalCat._id,
        eventDate: new Date('2025-11-01'),
        city: 'Varanasi', country: 'India', venue: 'Dashashwamedh Ghat',
        suggestedDonation: 2500, estimatedTravelBudget: 10000,
        eventBanner: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Heritage Hikes', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '2 Days', difficulty: 'Easy',
        expenditure: { transport: 2000, accommodation: 3000, food: 3000, activities: 1000, permits: 500, miscellaneous: 500 }
      },
      {
        eventTitle: 'Srinagar Houseboat Stay',
        eventSubtitle: 'Venice of the East',
        category: culturalCat._id,
        eventDate: new Date('2025-05-15'),
        city: 'Srinagar', country: 'India', venue: 'Dal Lake',
        suggestedDonation: 10000, estimatedTravelBudget: 40000,
        eventBanner: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Spiti Nomads', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '4 Days', difficulty: 'Easy',
        expenditure: { transport: 8000, accommodation: 15000, food: 10000, activities: 5000, permits: 1000, miscellaneous: 1000 }
      },
      {
        eventTitle: 'Manali Solang Valley Adventure',
        eventSubtitle: 'Valley of Gods',
        category: adventureCat._id,
        eventDate: new Date('2025-06-10'),
        city: 'Manali', country: 'India', venue: 'Solang Valley',
        suggestedDonation: 7000, estimatedTravelBudget: 30000,
        eventBanner: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Himalayan Masters', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '5 Days', difficulty: 'Moderate',
        expenditure: { transport: 6000, accommodation: 10000, food: 8000, activities: 5000, permits: 500, miscellaneous: 500 }
      },
      {
        eventTitle: 'Ooty Heritage Train & Hills',
        eventSubtitle: 'Blue Mountains',
        category: culturalCat._id,
        eventDate: new Date('2025-05-20'),
        city: 'Ooty', country: 'India', venue: 'Botanical Garden',
        suggestedDonation: 4000, estimatedTravelBudget: 18000,
        eventBanner: 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Heritage Hikes', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '3 Days', difficulty: 'Easy',
        expenditure: { transport: 3000, accommodation: 6000, food: 5000, activities: 3000, permits: 500, miscellaneous: 500 }
      },
      {
        eventTitle: 'Gir National Park',
        eventSubtitle: 'Home of the Asiatic Lion',
        category: wildlifeCat._id,
        eventDate: new Date('2025-11-20'),
        city: 'Sasan Gir', country: 'India', venue: 'Gir Interpretation Zone',
        suggestedDonation: 8000, estimatedTravelBudget: 30000,
        eventBanner: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80',
        eventPoster: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
        eventThumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=400&q=80',
        organizerName: 'Wild India', organizerLogo: oLogo,
        eventStatus: 'Upcoming', duration: '3 Days', difficulty: 'Easy',
        expenditure: { transport: 6000, accommodation: 10000, food: 5000, activities: 7000, permits: 1000, miscellaneous: 1000 }
      }
    ];

    await Event.insertMany(eventsData);
    console.log('✅ SEEDING COMPLETE - All 16 unique places have guaranteed assets!');
  } catch (err) {
    console.error('❌ SEEDING FAILED:', err.message);
  }
};

module.exports = seedDatabase;
