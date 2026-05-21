const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

dotenv.config();

const sampleEvents = [
  {
    title: "Sunset Guitar Jam at Cubbon Park",
    category: "music",
    subCategory: "Guitar Jams",
    description: "Bring your acoustic guitars and join fellow music lovers for an evening of melodies under the stars. All skill levels welcome!",
    bannerImage: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1",
    location: {
      address: "Cubbon Park, Kasturba Road",
      city: "Bangalore",
      coordinates: { lat: 12.9767, lng: 77.5933 }
    },
    maxParticipants: 30,
    eventDate: "2024-02-15T17:00:00",
    tags: ["acoustic", "outdoor", "beginner-friendly", "community"],
    status: "approved"
  },
  {
    title: "Nandi Hills Sunrise Cycle Ride",
    category: "bike",
    subCategory: "Sunrise Bike Ride",
    description: "Join the cycling community for an early morning ride to Nandi Hills. Witness breathtaking sunrise views from the top!",
    bannerImage: "https://images.unsplash.com/photo-1571068316344-75bc76f77890",
    location: {
      address: "Nandi Hills, Chikkaballapur",
      city: "Bangalore",
      coordinates: { lat: 13.3702, lng: 77.6835 }
    },
    maxParticipants: 20,
    eventDate: "2024-02-20T04:30:00",
    tags: ["cycling", "adventure", "sunrise", "fitness"],
    status: "approved"
  },
  {
    title: "Street Art Walking Tour",
    category: "painting",
    subCategory: "Street Art Meetup",
    description: "Explore Bangalore's vibrant street art scene. Visit murals, graffiti spots, and meet local artists.",
    bannerImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    location: {
      address: "Shivajinagar, Bangalore",
      city: "Bangalore",
      coordinates: { lat: 12.9833, lng: 77.6033 }
    },
    maxParticipants: 25,
    eventDate: "2024-02-18T10:00:00",
    tags: ["art", "walking-tour", "culture", "photography"],
    status: "approved"
  },
  {
    title: "Food Hopping: VV Puram Food Street",
    category: "food",
    subCategory: "Food Exploration Meetup",
    description: "Taste the best street food in Bangalore! From dosas to kebabs, we'll explore every stall.",
    bannerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    location: {
      address: "VV Puram Food Street, Bangalore",
      city: "Bangalore",
      coordinates: { lat: 12.9468, lng: 77.5698 }
    },
    maxParticipants: 15,
    eventDate: "2024-02-22T19:00:00",
    tags: ["food", "street-food", "social", "weekend"],
    status: "approved"
  },
  {
    title: "Weekend Football at Sports Complex",
    category: "sports",
    subCategory: "Football Matches",
    description: "Friendly 5-a-side football matches. All skill levels welcome! Bring your boots and energy.",
    bannerImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    location: {
      address: "Kanteerava Stadium, Bangalore",
      city: "Bangalore",
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    maxParticipants: 22,
    eventDate: "2024-02-17T07:00:00",
    tags: ["sports", "football", "fitness", "weekend"],
    status: "approved"
  }
];

const seedDB = async () => {
  try {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to Atlas MongoDB');
    } catch (atlasError) {
      console.log('Atlas connection failed, trying memory server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      console.log('Connected to Memory MongoDB');
    }

    // Create a default organizer if none exists
    let defaultOrganizer = await User.findOne({ role: { $in: ['admin', 'organizer'] } }) || await User.findOne();
    
    if (!defaultOrganizer) {
      console.log('No user found. Creating a temporary seed user...');
      defaultOrganizer = await User.create({
        name: 'Seed Organizer',
        email: 'organizer@test.com',
        password: 'password123',
        role: 'organizer',
        interests: ['music', 'bike', 'photography']
      });
    }

    const eventsWithOrganizer = sampleEvents.map(event => ({
      ...event,
      organizer: defaultOrganizer._id
    }));

    await Event.deleteMany({});
    await Event.insertMany(eventsWithOrganizer);

    console.log('Database seeded with sample events!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
