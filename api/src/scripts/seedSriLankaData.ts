import mongoose, { Types } from 'mongoose';
import User from '../models/User.model';
import Property from '../models/property.model';
import Review from '../models/review.model';
import Inquiry from '../models/inquiry.model';
import Visit from '../models/visit.model';
import Report from '../models/report.model';
import SavedSearch from '../models/savedSearch.model';
import ChatThread from '../models/chatThread.model';
import RiskFlag from '../models/riskFlag.model';
import { MONGO_URI } from '../config';

type Role = 'user' | 'agent' | 'admin';

const sriLankaCities = [
  { city: 'Colombo', state: 'Western Province', zip: '00100', lat: 6.9271, lng: 79.8612 },
  { city: 'Kandy', state: 'Central Province', zip: '20000', lat: 7.2906, lng: 80.6337 },
  { city: 'Galle', state: 'Southern Province', zip: '80000', lat: 6.0535, lng: 80.221 },
  { city: 'Negombo', state: 'Western Province', zip: '11500', lat: 7.2083, lng: 79.8358 },
  { city: 'Jaffna', state: 'Northern Province', zip: '40000', lat: 9.6615, lng: 80.0255 },
  { city: 'Nugegoda', state: 'Western Province', zip: '10250', lat: 6.865, lng: 79.8997 },
  { city: 'Batticaloa', state: 'Eastern Province', zip: '30000', lat: 7.7102, lng: 81.6924 },
  { city: 'Kurunegala', state: 'North Western Province', zip: '60000', lat: 7.4863, lng: 80.3623 },
  { city: 'Matara', state: 'Southern Province', zip: '81000', lat: 5.9549, lng: 80.555 },
  { city: 'Trincomalee', state: 'Eastern Province', zip: '31000', lat: 8.5874, lng: 81.2152 },
];

const sriLankanNames = [
  'Kasun Perera',
  'Nadeesha Silva',
  'Dilan Fernando',
  'Tharindu Jayasinghe',
  'Sanduni Wickramasinghe',
  'Ravindu Gunasekara',
  'Chamodi Ranasinghe',
  'Iresha Samarasinghe',
  'Malith Cooray',
  'Thilini Madushani',
  'Sachintha Karunaratne',
  'Upeksha Bandara',
  'Nuwan Rajapaksa',
  'Piumi Senanayake',
  'Kavindu Ekanayake',
  'Amaya Liyanage',
  'Dineth Abeywardana',
  'Sewwandi Gamage',
  'Rameshwaran Tharmalingam',
  'Kishani Weerasinghe',
];

const propertyTitles = [
  'Modern Family House Near Parliament',
  'Luxury Apartment with Ocean View',
  'Commercial Space in City Center',
  'Quiet Residential Land Plot',
  'Fully Furnished Condo in Colombo',
  'Spacious Home Close to International School',
  'Boutique Villa Near Beach',
  'Investment Property with High Rental Yield',
  'Contemporary Duplex in Prime Neighborhood',
  'Office Space with Parking Facilities',
];

const propertyImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600566753104-685f06b2f8d5?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
];

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const roleByIndex = (index: number): Role => {
  if (index === 0) return 'admin';
  if (index <= 6) return 'agent';
  return 'user';
};

async function seedUsers() {
  const timestamp = Date.now();
  const usersToInsert = sriLankanNames.map((name, index) => {
    const role = roleByIndex(index);
    return {
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}.${timestamp}.${index}@realestate.lk`,
      password: 'Password@123',
      role,
      phone: `+9477${String(randomBetween(1000000, 9999999))}`,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
      isActive: true,
      isEmailVerified: true,
      company: role === 'agent' ? `${name.split(' ')[0]} Property Partners` : undefined,
      experience: role === 'agent' ? randomBetween(2, 15) : 0,
      bio:
        role === 'agent'
          ? `${name} is a Sri Lankan property specialist focusing on premium local listings and reliable buyer guidance.`
          : undefined,
      specialty: role === 'agent' ? ['residential', 'investment'] : undefined,
    };
  });

  const users = await User.insertMany(usersToInsert);
  return {
    admins: users.filter((u) => u.role === 'admin'),
    agents: users.filter((u) => u.role === 'agent'),
    buyers: users.filter((u) => u.role === 'user'),
    all: users,
  };
}

async function seedProperties(agentIds: Types.ObjectId[], createdByIds: Types.ObjectId[]) {
  const properties = Array.from({ length: 60 }).map((_, index) => {
    const location = pick(sriLankaCities);
    const title = `${pick(propertyTitles)} - ${location.city}`;
    const type = pick(['house', 'apartment', 'condo', 'land', 'commercial'] as const);
    const status = pick(['for_sale', 'for_rent'] as const);
    const randomImagePrimary = pick(propertyImages);
    const randomImageSecondary = pick(propertyImages);

    return {
      title,
      description: `${title} in ${location.city}, ${location.state}. Ideal for Sri Lankan families and investors. Includes nearby schools, transport, and lifestyle conveniences.`,
      type,
      status,
      price:
        status === 'for_rent'
          ? randomBetween(90000, 420000)
          : randomBetween(18000000, 120000000),
      bedrooms: type === 'land' || type === 'commercial' ? randomBetween(0, 2) : randomBetween(2, 6),
      bathrooms: type === 'land' ? 0 : randomBetween(1, 5),
      area: randomBetween(900, 6500),
      yearBuilt: randomBetween(1995, 2025),
      address: {
        street: `${randomBetween(10, 250)} ${pick(['Lake', 'Temple', 'Galle', 'Marine', 'Flower'])} Road`,
        city: location.city,
        state: location.state,
        zipCode: location.zip,
        country: 'Sri Lanka',
      },
      location: {
        type: 'Point',
        coordinates: [location.lng + Math.random() * 0.05, location.lat + Math.random() * 0.05],
      },
      amenities: ['Parking', 'Security', 'Balcony', 'Gym', 'Garden'].slice(0, randomBetween(2, 5)),
      images: [randomImagePrimary, randomImageSecondary],
      moderationStatus: 'approved',
      moderationNotes: '',
      whatsappNumber: `+9477${String(randomBetween(1000000, 9999999))}`,
      emailContact: `agent${index}@realestate.lk`,
      agent: pick(agentIds),
      createdBy: pick(createdByIds),
    };
  });

  return Property.insertMany(properties);
}

async function seedReviews(propertyIds: Types.ObjectId[], buyerIds: Types.ObjectId[]) {
  const reviewDocs = [];
  const usedPairs = new Set<string>();

  for (let i = 0; i < 120; i += 1) {
    const propertyId = pick(propertyIds);
    const buyerId = pick(buyerIds);
    const key = `${propertyId.toString()}_${buyerId.toString()}`;
    if (usedPairs.has(key)) continue;
    usedPairs.add(key);

    reviewDocs.push({
      property: propertyId,
      user: buyerId,
      rating: randomBetween(3, 5),
      comment: pick([
        'Excellent neighborhood and very helpful agent communication.',
        'Great value for money and clean surroundings.',
        'Good access to schools and supermarkets.',
        'The property condition matched the listing photos.',
        'Very smooth viewing process and clear ownership details.',
      ]),
    });
  }

  if (reviewDocs.length > 0) {
    await Review.insertMany(reviewDocs, { ordered: false });
  }
}

async function seedInquiriesAndVisits(properties: any[], buyerIds: Types.ObjectId[]) {
  const inquiries = [];
  const visits = [];

  for (let i = 0; i < 90; i += 1) {
    const property = pick(properties);
    const requester = pick(buyerIds);
    const startAt = new Date(Date.now() + randomBetween(1, 20) * 24 * 60 * 60 * 1000);
    const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);

    inquiries.push({
      property: property._id,
      requester,
      agent: property.agent,
      message: `Hi, I am interested in ${property.title}. Please share more details and availability.`,
      contactEmail: `buyer${i}@mail.lk`,
      contactPhone: `+9477${String(randomBetween(1000000, 9999999))}`,
      status: pick(['new', 'contacted', 'closed'] as const),
    });

    visits.push({
      property: property._id,
      requester,
      agent: property.agent,
      requestedStartAt: startAt,
      requestedEndAt: endAt,
      scheduledStartAt: startAt,
      scheduledEndAt: endAt,
      status: pick(['pending', 'accepted', 'completed', 'rescheduled'] as const),
      requesterNote: 'Looking for a family-friendly neighborhood and secure environment.',
      agentNote: 'Please carry identity document for site visit.',
    });
  }

  await Inquiry.insertMany(inquiries);
  await Visit.insertMany(visits);
}

async function seedReports(propertyIds: Types.ObjectId[], buyerIds: Types.ObjectId[], adminId: Types.ObjectId) {
  const reports = Array.from({ length: 25 }).map(() => ({
    reporter: pick(buyerIds),
    targetType: 'property',
    targetId: pick(propertyIds),
    reason: pick(['spam', 'fraud', 'misleading_information', 'duplicate_listing', 'other'] as const),
    description: pick([
      'Duplicate listing appears with slightly changed details.',
      'Description and image quality do not match expected standards.',
      'Suspicious pricing compared to nearby listings.',
      'Potential misinformation in listed amenities.',
    ]),
    status: pick(['open', 'in_review', 'resolved'] as const),
    reviewedBy: adminId,
    reviewedAt: new Date(),
    resolutionNote: 'Reviewed by moderation team.',
  }));

  await Report.insertMany(reports);
}

async function seedSavedSearches(buyerIds: Types.ObjectId[]) {
  const docs = buyerIds.map((userId, index) => ({
    user: userId,
    name: `Sri Lanka Search ${index + 1}`,
    filters: {
      city: pick(sriLankaCities).city,
      status: pick(['for_sale', 'for_rent'] as const),
      minPrice: randomBetween(10000000, 35000000),
      maxPrice: randomBetween(35000001, 120000000),
    },
    isAlertEnabled: true,
    frequency: pick(['instant', 'daily', 'weekly'] as const),
    isActive: true,
    lastResultCount: randomBetween(2, 18),
    lastRunAt: new Date(),
  }));

  await SavedSearch.insertMany(docs, { ordered: false });
}

async function seedChatThreads(properties: any[], buyerIds: Types.ObjectId[], agentIds: Types.ObjectId[]) {
  const docs = Array.from({ length: 40 }).map(() => {
    const buyer = pick(buyerIds);
    const agent = pick(agentIds);
    const property = pick(properties);
    return {
      participants: [buyer, agent],
      property: property._id,
      lastMessage: pick([
        'Can we schedule a visit this weekend?',
        'Is the price negotiable for immediate purchase?',
        'Please confirm parking availability and maintenance fees.',
        'I would like to see the legal ownership documents.',
      ]),
      lastMessageAt: new Date(),
      isEscalated: Math.random() < 0.15,
    };
  });

  await ChatThread.insertMany(docs);
}

async function seedRiskFlags(
  propertyIds: Types.ObjectId[],
  buyerIds: Types.ObjectId[],
  reviewIds: Types.ObjectId[]
) {
  const docs = Array.from({ length: 35 }).map(() => {
    const targetType = pick(['property', 'user', 'review'] as const);
    const targetId =
      targetType === 'property'
        ? pick(propertyIds)
        : targetType === 'user'
        ? pick(buyerIds)
        : pick(reviewIds);

    return {
      targetType,
      targetId,
      score: randomBetween(40, 95),
      reasons: [pick(['price anomaly', 'duplicate listing', 'spam pattern', 'rapid repost'])],
      status: pick(['open', 'resolved'] as const),
    };
  });

  await RiskFlag.insertMany(docs);
}

async function printSummary() {
  const [
    userCount,
    propertyCount,
    reviewCount,
    inquiryCount,
    visitCount,
    reportCount,
    savedSearchCount,
    chatThreadCount,
    riskFlagCount,
  ] =
    await Promise.all([
      User.countDocuments({}),
      Property.countDocuments({}),
      Review.countDocuments({}),
      Inquiry.countDocuments({}),
      Visit.countDocuments({}),
      Report.countDocuments({}),
      SavedSearch.countDocuments({}),
      ChatThread.countDocuments({}),
      RiskFlag.countDocuments({}),
    ]);

  console.log('Seed complete. Current totals:');
  console.log(
    JSON.stringify(
      {
        users: userCount,
        properties: propertyCount,
        reviews: reviewCount,
        inquiries: inquiryCount,
        visits: visitCount,
        reports: reportCount,
        savedSearches: savedSearchCount,
        chatThreads: chatThreadCount,
        riskFlags: riskFlagCount,
      },
      null,
      2
    )
  );
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Sri Lanka dataset seeding...');

    const users = await seedUsers();
    const properties = await seedProperties(
      users.agents.map((a) => a._id as Types.ObjectId),
      users.all.map((u) => u._id as Types.ObjectId)
    );

    await seedReviews(
      properties.map((p) => p._id as Types.ObjectId),
      users.buyers.map((u) => u._id as Types.ObjectId)
    );
    const reviewIds = (await Review.find({}, { _id: 1 }).limit(200)).map(
      (r) => r._id as unknown as Types.ObjectId
    );
    await seedInquiriesAndVisits(properties, users.buyers.map((u) => u._id as Types.ObjectId));
    await seedReports(
      properties.map((p) => p._id as Types.ObjectId),
      users.buyers.map((u) => u._id as Types.ObjectId),
      users.admins[0]._id as Types.ObjectId
    );
    await seedSavedSearches(users.buyers.map((u) => u._id as Types.ObjectId));
    await seedChatThreads(
      properties,
      users.buyers.map((u) => u._id as Types.ObjectId),
      users.agents.map((u) => u._id as Types.ObjectId)
    );
    await seedRiskFlags(
      properties.map((p) => p._id as Types.ObjectId),
      users.buyers.map((u) => u._id as Types.ObjectId),
      reviewIds
    );

    await printSummary();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
