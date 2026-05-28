/**
 * Seed script: generate 8000 Iraqi businesses and output as SQL INSERTs.
 * Run: npx tsx scripts/seed-8000-businesses.ts > seed.sql
 * Then: wrangler d1 execute billboard3d-db --file=seed.sql
 */

const CATEGORIES = [
  'Food & Beverage',
  'Restaurants & Cafes',
  'Retail Stores',
  'Hotels & Hospitality',
  'Beauty & Salons',
  'Fitness & Gyms',
  'Health & Medical Services',
  'Education & Training Centers',
  'Entertainment & Events',
  'Technology',
  'Real Estate',
  'Auto Services',
  'Advertising',
  'Marketing',
  'Construction',
  'Logistics',
];

const GOVERNORATES = [
  'baghdad', 'basra', 'erbil', 'sulaymaniyah', 'najaf', 'mosul',
  'karbala', 'kirkuk', 'anbar', 'duhok', 'babil', 'diyala',
  'wasit', 'saladin', 'maysan', 'dhiqar', 'muthanna', 'qadisiya', 'halabja'
];

const CITIES: Record<string, string[]> = {
  baghdad: ['Baghdad', 'Sadr City', 'Karrada', 'Mansour'],
  basra: ['Basra', 'Zubair', 'Umm Qasr'],
  erbil: ['Erbil', 'Shaqlawa', 'Soran'],
  sulaymaniyah: ['Sulaymaniyah', 'Halabja', 'Ranya'],
  najaf: ['Najaf', 'Kufa'],
  mosul: ['Mosul', 'Tel Afar', 'Hamdaniya'],
  karbala: ['Karbala', 'Ain Al-Tamur'],
  kirkuk: ['Kirkuk', 'Hawija'],
  anbar: ['Ramadi', 'Fallujah', 'Haditha'],
  duhok: ['Duhok', 'Amedi', 'Zakho'],
  babil: ['Hillah', 'Musayyib'],
  diyala: ['Baqubah', 'Muqdadiyah'],
  wasit: ['Kut', 'Al-Hay'],
  saladin: ['Tikrit', 'Samarra'],
  maysan: ['Amarah', 'Ali Al-Gharbi'],
  dhiqar: ['Nasiriyah', 'Suq Al-Shoyokh'],
  muthanna: ['Samawah', 'Rumaitha'],
  qadisiya: ['Diwaniyah', 'Afak'],
  halabja: ['Halabja'],
};

const FIRST_NAMES = [
  'Al-Mustafa', 'Al-Karim', 'Al-Rashid', 'Al-Nour', 'Al-Salam', 'Al-Yasmin',
  'Al-Furat', 'Al-Tigris', 'Al-Baghdadi', 'Al-Basri', 'Al-Erbili', 'Al-Najafi',
  'Al-Mosuli', 'Al-Kirkuk', 'Al-Anbari', 'Al-Duhoki', 'Golden', 'Royal', 'Modern',
  'Elite', 'Prime', 'City', 'Downtown', 'Sunrise', 'Sunset', 'Star', 'Moon',
  'Oasis', 'Paradise', 'Horizon', 'Skyline', 'Emerald', 'Diamond', 'Pearl',
  'Crystal', 'Sapphire', 'Azure', 'Crimson', 'Verdant', 'Imperial', 'Grand',
  'Supreme', 'Premium', 'Classic', 'Heritage', 'National', 'Universal',
  'Global', 'Pacific', 'Atlantic', 'Mediterranean', 'Gulf', 'Desert', 'River',
  'Garden', 'Palace', 'Plaza', 'Tower', 'Village', 'Square', 'Avenue', 'Boulevard',
];

const SECOND_NAMES = [
  'Restaurant', 'Cafe', 'Hotel', 'Shop', 'Store', 'Market', 'Mall', 'Center',
  'Clinic', 'Hospital', 'Pharmacy', 'Gym', 'Salon', 'Spa', 'Studio', 'Gallery',
  'Agency', 'Company', 'Group', 'Corporation', 'Enterprise', 'Solutions',
  'Services', 'Consultants', 'Traders', 'Contractors', 'Builders', 'Developers',
  'Logistics', 'Shipping', 'Transport', 'Travel', 'Tourism', 'Events',
  'Media', 'Advertising', 'Digital', 'Tech', 'IT', 'Systems', 'Networks',
  'Electronics', 'Mobile', 'Auto', 'Cars', 'Motors', 'Garage', 'Workshop',
  'Bakery', 'Sweets', 'Catering', 'Delivery', 'Coffee', 'Tea', 'Juice',
  'Furniture', 'Decor', 'Design', 'Fashion', 'Boutique', 'Jewelry', 'Watches',
  'Books', 'Library', 'Stationery', 'Printing', 'Photography', 'Music',
  'Cinema', 'Games', 'Sports', 'Equipment', 'Tools', 'Hardware', 'Plumbing',
  'Electrical', 'Appliances', 'Real Estate', 'Property', 'Rentals', 'Cleaning',
  'Security', 'Maintenance', 'Repair', 'Laundry', 'Tailor', 'Shoes', 'Bags',
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBusiness(index: number) {
  const gov = rand(GOVERNORATES);
  const city = rand(CITIES[gov] || ['Baghdad']);
  const category = rand(CATEGORIES);
  const name = `${rand(FIRST_NAMES)} ${rand(SECOND_NAMES)}`;
  const id = `biz-${String(index + 1).padStart(5, '0')}`;
  const now = new Date().toISOString();

  return {
    id,
    name,
    description: `${name} provides excellent ${category.toLowerCase()} services in ${city}, Iraq.`,
    bio: `${name} — your trusted partner in ${city}.`,
    category,
    city,
    governorate: gov,
    country: 'Iraq',
    website: `https://${name.toLowerCase().replace(/\s+/g, '-')}.iq`,
    email: `info@${name.toLowerCase().replace(/\s+/g, '')}.iq`,
    phone: `+964-${randInt(1, 9)}${randInt(0, 9)}${randInt(0, 9)}-${randInt(100, 999)}-${randInt(1000, 9999)}`,
    mobile: `+964-7${randInt(5, 9)}${randInt(0, 9)}-${randInt(100, 999)}-${randInt(1000, 9999)}`,
    address: `${randInt(1, 999)} ${rand(['Main St', 'Al-Rashid St', 'Karrada Ave', 'Al-Jamhuriya St', 'Al-Nidal St', 'Tahrir Square', 'Al-Mansour Blvd', 'Al-Sadoon St'])}, ${city}`,
    rating: +(Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    reviewCount: randInt(0, 500),
    views: randInt(10, 5000),
    likes: randInt(0, 1000),
    saves: randInt(0, 500),
    verified: Math.random() > 0.7 ? 1 : 0,
    isActive: 1,
    createdAt: now,
    updatedAt: now,
  };
}

const TOTAL = 8000;
const BATCH_SIZE = 500;

console.log('-- Generated seed data for 8000 Iraqi businesses');
console.log(`-- ${new Date().toISOString()}`);
console.log();

for (let batchStart = 0; batchStart < TOTAL; batchStart += BATCH_SIZE) {
  const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL);
  const values: string[] = [];

  for (let i = batchStart; i < batchEnd; i++) {
    const b = generateBusiness(i);
    values.push(
      `('${b.id}', '${b.name.replace(/'/g, "''")}', '${b.description.replace(/'/g, "''")}', '${b.bio.replace(/'/g, "''")}', '${b.category}', '${b.city}', '${b.governorate}', '${b.country}', '${b.website}', '${b.email}', '${b.phone}', '${b.mobile}', '${b.address.replace(/'/g, "''")}', ${b.rating}, ${b.reviewCount}, ${b.views}, ${b.likes}, ${b.saves}, ${b.verified}, ${b.isActive}, '${b.createdAt}', '${b.updatedAt}')`
    );
  }

  console.log(`INSERT INTO businesses (id, name, description, bio, category, city, governorate, country, website, email, phone, mobile, address, rating, review_count, views, likes, saves, verified, is_active, created_at, updated_at) VALUES`);
  console.log(values.join(',\n'));
  console.log('ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, category=excluded.category, city=excluded.city, governorate=excluded.governorate, rating=excluded.rating, updated_at=excluded.updated_at;');
  console.log();
}
