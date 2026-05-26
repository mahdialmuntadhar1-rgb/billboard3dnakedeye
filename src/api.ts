/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Business, Review, Inquiry, FilterState, BusinessAnalytics } from './types';

// Concrete top-tier mock data mimicking production responses
const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'The Foundry Coworking',
    nameAr: 'مساحة العمل المشتركة فاوندري',
    nameKu: 'مەکۆی کارکردنی هاوبەشی فاوندری',
    description: 'A premium, architectural-grade workspace designed for modern creators, startups, and digital nomads. Offers hot desks, private offices, ultra high-speed fiber, custom-roasted espresso, and biophilic meeting rooms.',
    descriptionAr: 'مساحة عمل متميزة ومصممة هندسياً للمبدعين والشركات الناشئة والرحالة الرقميين. توفر مكاتب مشتركة، مكاتب خاصة، إنترنت فايبر فائق السرعة، ومشروبات مميزة وغرف اجتماعات معززة بالطبيعة.',
    descriptionKu: 'شوێنێکی کاری نایابی دیزاین کراوە بۆ داهێنەران، کۆمپانیا نوێیەکان و گەڕۆکە دیجیتاڵییەکان. مێزی هاوبەش، نووسینگەی تایبەت، ئینتەرنێتی زۆر خێرا، قاوەی لێنراوی تایبەت، و ژووری کۆبوونەوەی سەرنجڕاکێش پێشکەش دەکات.',
    category: 'it-software',
    rating: 4.8,
    reviewsCount: 142,
    priceLevel: '$$',
    location: 'Erbil',
    locationAr: 'أربيل',
    locationKu: 'هەولێر',
    address: '404 Innovation Way, Tech Park',
    addressAr: '٤٠٤ طريق الابتكار، واحة التقنية',
    addressKu: '٤٠٤ ڕێگای داهێنان، پارکی تەکنەلۆجیا',
    phone: '+971 4 555 1234',
    website: 'https://thefoundryspace.example.com',
    email: 'hello@foundryspace.example.com',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600'
    ],
    isVerified: true,
    isFeatured: true,
    isOpenNow: true,
    amenities: ['High-Speed Wi-Fi', 'Free Coffee', 'Meeting Rooms', '24/7 Access', 'Phone Booths'],
    amenitiesAr: ['واي فاي فائق السرعة', 'قهوة مجانية', 'غرف اجتماعات', 'دخول ٢٤/٧', 'كبائن مكالمات'],
    amenitiesKu: ['ئینتەرنێتی زۆر خێرا', 'قاوەی بێبەرامبەر', 'ژووری کۆبوونەوە', 'دەروازەی ٢٤/٧', 'کابینەی تەلەفۆن'],
    latitude: 25.1972,
    longitude: 55.2744,
    workingHours: {
      monday: '08:00 AM - 10:00 PM',
      tuesday: '08:00 AM - 10:00 PM',
      wednesday: '08:00 AM - 10:00 PM',
      thursday: '08:00 AM - 10:00 PM',
      friday: '08:00 AM - 06:00 PM',
      saturday: '09:00 AM - 05:00 PM',
      sunday: 'Closed'
    },
    workingHoursAr: {
      monday: '٠٨:٠٠ ص - ١٠:٠٠ م',
      tuesday: '٠٨:٠٠ ص - ١٠:٠٠ م',
      wednesday: '٠٨:٠٠ ص - ١٠:٠٠ م',
      thursday: '٠٨:٠٠ ص - ١٠:٠٠ م',
      friday: '٠٨:٠٠ ص - ٠٦:٠٠ م',
      saturday: '٠٩:٠٠ ص - ٠٥:٠٠ م',
      sunday: 'مغلق'
    },
    workingHoursKu: {
      monday: '٠٨:٠٠ ب.ن - ١٠:٠٠ د.ن',
      tuesday: '٠٨:٠٠ ب.ن - ١٠:٠٠ د.ن',
      wednesday: '٠٨:٠٠ ب.ن - ١٠:٠٠ د.ن',
      thursday: '٠٨:٠٠ ب.ن - ١٠:٠٠ د.ن',
      friday: '٠٨:٠٠ ب.ن - ٠٦:٠٠ د.ن',
      saturday: '٠٩:٠٠ ب.ن - ٠٥:٠٠ د.ن',
      sunday: 'داخراوە'
    }
  },
  {
    id: 'b2',
    name: 'Saffron Artisanal Bistro',
    nameAr: 'بيسترو الزعفران الحرفي',
    nameKu: 'بۆفیەی شاهانەی زەعفەران',
    description: 'An elegant culinary sanctuary merging Levantine heritage with modernist gastronomic techniques. Features a seasonal farm-to-table organic program, visual open kitchen, and a curated mocktail catalog.',
    descriptionAr: 'ملاذ طهي أنيق يدمج التراث الشامي مع تقنيات الطهي الحديثة. يتميز بقائمة طعام موسمية عضوية من المزرعة إلى المائدة، ومطبخ مفتوح، وقائمة مشروبات مبتكرة.',
    descriptionKu: 'پەناگەیەکی چێشت لێنانە کە کولتووری شام لەگەڵ تەکنیکە مۆدێرنەکانی خواردن ئاوێتە دەکات. خاوەنی خواردنی ئۆرگانیکی وەرزی کێڵگە-بۆ-سەر-مێز، چێشتخانەی کراوەی بینراو، و لیستی خواردنەوەی سەرنجڕاکێشە.',
    category: 'restaurants-cafes',
    rating: 4.9,
    reviewsCount: 312,
    priceLevel: '$$$',
    location: 'Baghdad',
    locationAr: 'بغداد',
    locationKu: 'بەغداد',
    address: '12 Al Moaza Boulevard, Boulevard East',
    addressAr: '١٢ شارع الموعزة، جادة الشرق',
    addressKu: '١٢ شەقامی ئەلموعەزە، ڕۆژهەڵاتی بولڤار',
    phone: '+971 4 555 9876',
    website: 'https://saffronbistro.example.com',
    email: 'reservations@saffronbistro.example.com',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
    ],
    isVerified: true,
    isFeatured: true,
    isOpenNow: true,
    amenities: ['Valet Parking', 'Outdoor Seating', 'Live Music', 'Vegan Options', 'Wheelchair Accessible'],
    amenitiesAr: ['خدمة ركن السيارات', 'جلسات خارجية', 'موسيقى حية', 'خيارات نباتية', 'كرسي متحرك متاح'],
    amenitiesKu: ['خزمەتگوزاری ڕاگرتنی ئۆتۆمبێل', 'دانیشتنی دەرەوە', 'مۆسیقای ڕاستەوخۆ', 'خواردنی ڕووەکی', 'ڕێڕەوی عەرەبانە'],
    latitude: 25.2048,
    longitude: 55.2708,
    workingHours: {
      monday: '12:00 PM - 11:30 PM',
      tuesday: '12:00 PM - 11:30 PM',
      wednesday: '12:00 PM - 11:30 PM',
      thursday: '12:00 PM - 12:30 AM',
      friday: '12:30 PM - 01:00 AM',
      saturday: '12:00 PM - 01:00 AM',
      sunday: '12:00 PM - 11:00 PM'
    },
    workingHoursAr: {
      monday: '١٢:٠٠ م - ١١:٣٠ م',
      tuesday: '١٢:٠٠ م - ١١:٣٠ م',
      wednesday: '١٢:٠٠ م - ١١:٣٠ م',
      thursday: '١٢:٠٠ م - ١٢:٣٠ ص',
      friday: '١٢:٣٠ م - ٠١:٠٠ ص',
      saturday: '١٢:٠٠ م - ٠١:٠٠ ص',
      sunday: '١٢:٠٠ م - ١١:٠٠ م'
    },
    workingHoursKu: {
      monday: '١٢:٠٠ ن.ن - ١١:٣٠ د.ن',
      tuesday: '١٢:٠٠ ن.ن - ١١:٣٠ د.ن',
      wednesday: '١٢:٠٠ ن.ن - ١١:٣٠ د.ن',
      thursday: '١٢:٠٠ ن.ن - ١٢:٣٠ ش',
      friday: '١٢:٣٠ ن.ن - ٠١:٠٠ ش',
      saturday: '١٢:٠٠ ن.ن - ٠١:٠٠ ش',
      sunday: '١٢:٠٠ ن.ن - ١١:٠٠ د.ن'
    }
  },
  {
    id: 'b3',
    name: 'Aether Wellness Clinic',
    nameAr: 'عيادة أثير للياقة والعافية',
    nameKu: 'کلینیکی عافییەتی ئیسەر',
    description: 'An advanced, bespoke wellness center offering preventative healthcare, custom physical performance coaching, metabolic therapies, and high-precision dermatological skincare options.',
    descriptionAr: 'مركز عافية متطور ومخصص يقدم الرعاية الصحية الوقائية، والتدريب الشخصي على الأداء البدني، والعلاج الأيضي، وخيارات العناية بالبشرة عالية الدقة.',
    descriptionKu: 'ناوەندێکی پێشکەوتووی تەندروستی گشتگیر کە چاودێری تەندروستی خۆپارێزی و ڕاهێنانی تایبەت بە توانای جەستەیی پێشکەش دەکات.',
    category: 'health-medical',
    rating: 4.7,
    reviewsCount: 88,
    priceLevel: '$$$$',
    location: 'Basra',
    locationAr: 'البصرة',
    locationKu: 'بەسرە',
    address: 'Marina Heights, Floor 14',
    addressAr: 'أبراج المارينا، الطابق ١٤',
    addressKu: 'بەرزاییەکانی مارینا، نهۆمی ١٤',
    phone: '+971 4 555 4567',
    website: 'https://aetherwellness.example.com',
    email: 'info@aetherwellness.example.com',
    image: 'https://images.unsplash.com/photo-1519494390566-29b4db4248a6?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1519494390566-29b4db4248a6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1579684389781-71d03b695f92?auto=format&fit=crop&q=80&w=600'
    ],
    isVerified: true,
    isFeatured: false,
    isOpenNow: true,
    amenities: ['By Appointment Only', 'Certified Doctors', 'Private Suites', 'Lab on Site', 'Insurance Accepted'],
    amenitiesAr: ['بموعد مسبق فقط', 'أطباء معتمدون', 'أجنحة خاصة', 'مختبر في الموقع', 'نسعى للتعامل مع التأمين'],
    amenitiesKu: ['تەنها بە چاوپێکەوتنی پێشوەختە', 'پزیشکانی بڕوانامەدار', 'سویتە تایبەتەکان', 'تاقیگە لە شوێنەکەدا', 'قبڵکردنی دڵنیایی تەندروستی'],
    latitude: 25.0805,
    longitude: 55.1403,
    workingHours: {
      monday: '09:00 AM - 08:30 PM',
      tuesday: '09:00 AM - 08:30 PM',
      wednesday: '09:00 AM - 08:30 PM',
      thursday: '09:00 AM - 08:30 PM',
      friday: '09:00 AM - 04:00 PM',
      saturday: 'Closed',
      sunday: '01:00 PM - 06:00 PM'
    },
    workingHoursAr: {
      monday: '٠٩:٠٠ ص - ٠٨:٣٠ م',
      tuesday: '٠٩:٠٠ ص - ٠٨:٣٠ م',
      wednesday: '٠٩:٠٠ ص - ٠٨:٣٠ م',
      thursday: '٠٩:٠٠ ص - ٠٨:٣٠ م',
      friday: '٠٩:٠٠ ص - ٠٤:٠٠ م',
      saturday: 'مغلق',
      sunday: '٠١:٠٠ م - ٠٦:٠٠ م'
    },
    workingHoursKu: {
      monday: '٠٩:٠٠ ب.ن - ٠٨:٣٠ د.ن',
      tuesday: '٠٩:٠٠ ب.ن - ٠٨:٣٠ د.ن',
      wednesday: '٠٩:٠٠ ب.ن - ٠٨:٣٠ د.ن',
      thursday: '٠٩:٠٠ ب.ن - ٠٨:٣٠ د.ن',
      friday: '٠٩:٠٠ ب.ن - ٠٤:٠٠ د.ن',
      saturday: 'داخراوە',
      sunday: '٠١:٠٠ د.ن - ٠٦:٠٠ د.ن'
    }
  },
  {
    id: 'b4',
    name: 'Luminary Boutique Hotel',
    nameAr: 'فندق لوميناري البوتيكي',
    nameKu: 'فۆتێلی لومینیاری لوکس',
    description: 'An architectural hotel masterpiece consisting of 24 custom-curated duplex sky-lofts, overlooking spectacular water panoramas. Features private plunge pools, custom furniture pieces, and Michelin-tier breakfast service.',
    descriptionAr: 'تحفة معمارية فندقية تتكون من ٢٤ جناح بنتهاوس فخم يطل على مناظر مائية خلابة. تتميز بمسابح غطس خاصة، وأثاث مخصص، وخدمة إفطار بمستوى ميشلان.',
    descriptionKu: 'شاکارێکی تەلاری فندقی پێکهاتوو لە ٢٤ سویتی بەرز و دیمەنی ئاوی سەرنجڕاکێش.',
    category: 'hotels-hospitality',
    rating: 4.9,
    reviewsCount: 154,
    priceLevel: '$$$$',
    location: 'Nineveh',
    locationAr: 'نينوى',
    locationKu: 'نەینەوا',
    address: '88 Harbour Ridge Parkway',
    addressAr: '٨٨ طريق هاربور ريدج',
    addressKu: '٨٨ ڕێگای کەناری هاربر',
    phone: '+971 4 555 7777',
    website: 'https://luminaryhotel.example.com',
    email: 'concierge@luminaryhotel.example.com',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600'
    ],
    isVerified: true,
    isFeatured: true,
    isOpenNow: true,
    amenities: ['Infinity Pool', 'Spa Services', 'Butler Service', 'Private Beach Access', 'Fitness Facility'],
    amenitiesAr: ['مسبح إنفينيتي', 'خدمات صحية / سبا', 'خدمة الحاجب الخاص', 'شاطئ خاص', 'صالة لياقة بدنية'],
    amenitiesKu: ['مەلەوانگەی بێکۆتایی', 'خزمەتگوزاری سپا', 'خزمەتگوزاری نۆکەر', 'شاطئێکی تایبەت', 'هۆڵی وەرزشی'],
    latitude: 25.1011,
    longitude: 55.1322,
    workingHours: {
      monday: 'Open 24 Hours',
      tuesday: 'Open 24 Hours',
      wednesday: 'Open 24 Hours',
      thursday: 'Open 24 Hours',
      friday: 'Open 24 Hours',
      saturday: 'Open 24 Hours',
      sunday: 'Open 24 Hours'
    },
    workingHoursAr: {
      monday: 'مفتوح ٢٤ ساعة',
      tuesday: 'مفتوح ٢٤ ساعة',
      wednesday: 'مفتوح ٢٤ ساعة',
      thursday: 'مفتوح ٢٤ ساعة',
      friday: 'مفتوح ٢٤ ساعة',
      saturday: 'مفتوح ٢٤ ساعة',
      sunday: 'مفتوح ٢٤ ساعة'
    },
    workingHoursKu: {
      monday: '٢٤ کاتژمێر کراوەیە',
      tuesday: '٢٤ کاتژمێر کراوەیە',
      wednesday: '٢٤ کاتژمێر کراوەیە',
      thursday: '٢٤ کاتژمێر کراوەیە',
      friday: '٢٤ کاتژمێر کراوەیە',
      saturday: '٢٤ کاتژمێر کراوەیە',
      sunday: '٢٤ کاتژمێر کراوەیە'
    }
  },
  {
    id: 'b5',
    name: 'Obsidian Design Studio',
    nameAr: 'استوديو التصميم أوبسيديان',
    nameKu: 'ستۆدیۆی دیزاینی ئۆبسیدیان',
    description: 'An elite concept-driven interior design lab crafting highly sophisticated living environments for discerning private clients and conceptual retail boutiques worldwide.',
    descriptionAr: 'معمل تصميم داخلي مبني على مفاهيم النخبة لصياغة هياكل وبيئات معيشية متطورة للغاية للعملاء السكنيين ومعارض التجزئة الفاخرة عالمياً.',
    descriptionKu: 'تاقیگەیەکی نایابی دیزاینی ناوخۆیی بۆ ڕێکخستنی شوێنی ژیانی بێ عەیب بۆ کریارانی تایبەت.',
    category: 'retail-stores',
    rating: 4.5,
    reviewsCount: 36,
    priceLevel: '$$$',
    location: 'Erbil',
    locationAr: 'أربيل',
    locationKu: 'هەولێر',
    address: '99 Onyx Tower, Design District',
    addressAr: '٩٩ برج الجزع الأسود، حي التصميم',
    addressKu: '٩٩ بورجی ئۆنیکس، ناوچەی دیزاین',
    phone: '+971 4 555 9911',
    website: 'https://obsidiandesign.example.com',
    email: 'studio@obsidiandesign.example.com',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=600'
    ],
    isVerified: false,
    isFeatured: false,
    isOpenNow: false,
    amenities: ['Consultation Booking', 'Material Library', 'Showroom Access', 'Custom Mock-ups'],
    amenitiesAr: ['حجز استشاري', 'مكتبة الخامات', 'معرض حي', 'تصميمات وعينات مخصصة'],
    amenitiesKu: ['حجزی ڕاوێژکاری', 'کتێبخانەی کەرەستەکان', 'دەروازەی پێشانگا', 'نموونەی تایبەت'],
    latitude: 25.1865,
    longitude: 55.2631,
    workingHours: {
      monday: '09:00 AM - 06:00 PM',
      tuesday: '09:00 AM - 06:00 PM',
      wednesday: '09:00 AM - 06:00 PM',
      thursday: '09:00 AM - 06:00 PM',
      friday: '09:00 AM - 01:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    workingHoursAr: {
      monday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
      tuesday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
      wednesday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
      thursday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
      friday: '٠٩:٠٠ ص - ٠١:٠٠ م',
      saturday: 'مغلق',
      sunday: 'مغلق'
    },
    workingHoursKu: {
      monday: '٠٩:٠٠ ب.ن - ٠٦:٠٠ د.ن',
      tuesday: '٠٩:٠٠ ب.ن - ٠٦:٠٠ د.ن',
      wednesday: '٠٩:٠٠ ب.ن - ٠٦:٠٠ د.ن',
      thursday: '٠٩:٠٠ ب.ن - ٠٦:٠٠ د.ن',
      friday: '٠٩:٠٠ ب.ن - ٠١:٠٠ د.ن',
      saturday: 'داخراوە',
      sunday: 'داخراوە'
    }
  },
  {
    id: 'b6',
    name: 'Aapex Digital Logistics',
    nameAr: 'إيبكس للخدمات اللوجستية الرقمية',
    nameKu: 'کۆمپانیای لۆجستی دیجیتاڵی ئەیپێکس',
    description: 'Autonomous cargo, storage, dynamic supply chain consulting, and automated regional shipping logistics built on a modern AI-optimized tracking engine.',
    descriptionAr: 'شحن ذاتي، خدمات تخزين ذكية، استشارات سلاسل الإمداد سريعة الاستجابة، ونظام شحن إقليمي مؤتمت بالكامل ومعزز بنماذج تنبؤية.',
    descriptionKu: 'بارکردنی سەربەخۆ، عەمبارکردن، شیکردنەوەی سەرچاوەی دابینکردن، و گواستنەوەی جۆراوجۆر لەسەر بنەمای ژیری دەستکرد.',
    category: 'it-software',
    rating: 4.6,
    reviewsCount: 54,
    priceLevel: '$$$',
    location: 'Baghdad',
    locationAr: 'بغداد',
    locationKu: 'بەغداد',
    address: 'Ship Terminal B, Cargo Base',
    addressAr: 'رصيف الميناء ب، القاعدة اللوجستية',
    addressKu: 'وێستگەی باری بەندەر ب، بنکەی سەرەکی',
    phone: '+971 4 555 1122',
    website: 'https://aapexdigital.example.com',
    email: 'support@aapexdigital.example.com',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'
    ],
    isVerified: true,
    isFeatured: false,
    isOpenNow: true,
    amenities: ['Global Shipping', 'Cargo Insurance', 'Express Logistics', 'Warehousing Access', 'Real-time Tracking'],
    amenitiesAr: ['شحن دولي', 'تأمين على البضائع', 'لوجستيات سريعة', 'خدمات التخزين', 'تتبع حي للمركبات'],
    amenitiesKu: ['گواستنەوەی جیهانی', 'دڵنیایی بارکردن', 'لۆجستی خێرا', 'عەمبارکردم', 'تەقەکردنی ڕاستەوخۆ'],
    latitude: 25.0743,
    longitude: 55.1384,
    workingHours: {
      monday: '07:00 AM - 09:00 PM',
      tuesday: '07:00 AM - 09:00 PM',
      wednesday: '07:00 AM - 09:00 PM',
      thursday: '07:00 AM - 09:00 PM',
      friday: '07:00 AM - 09:00 PM',
      saturday: '08:00 AM - 04:00 PM',
      sunday: 'Closed'
    },
    workingHoursAr: {
      monday: '٠٧:٠٠ ص - ٠٩:٠٠ م',
      tuesday: '٠٧:٠٠ ص - ٠٩:٠٠ م',
      wednesday: '٠٧:٠٠ ص - ٠٩:٠٠ م',
      thursday: '٠٧:٠٠ ص - ٠٩:٠٠ م',
      friday: '٠٧:٠٠ ص - ٠٩:٠٠ م',
      saturday: '٠٨:٠٠ ص - ٠٤:٠٠ م',
      sunday: 'مغلق'
    },
    workingHoursKu: {
      monday: '٠٧:٠٠ ب.ن - ٠٩:٠٠ د.ن',
      tuesday: '٠٧:٠٠ ب.ن - ٠٩:٠٠ د.ن',
      wednesday: '٠٧:٠٠ ب.ن - ٠٩:٠٠ د.ن',
      thursday: '٠٧:٠٠ ب.ن - ٠٩:٠٠ د.ن',
      friday: '٠٧:٠٠ ب.ن - ٠٩:٠٠ د.ن',
      saturday: '٠٨:٠٠ ب.ن - ٠٤:٠٠ د.ن',
      sunday: 'داخراوە'
    }
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    businessId: 'b1',
    userName: 'Layla Al-Mansoori',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'The absolute best coworking in the city. The coffee is roast-to-perfection and the fiber connections never stutter. Worth every penny!',
    commentAr: 'أفضل مساحة عمل مشتركة في المدينة بلا منازع. القهوة محمصة بعناية وجودة الإنترنت مذهلة. يستحق كل قيمة!',
    commentKu: 'باشترین شوێنی کارکردنی هاوبەش لە شارەکەدا. قاوەکەی بە تەواوی برژاوە و هێڵەکانی ئینتەرنێت هەمیشە زۆر خێران. شایەنی هەموو فلسێکە!',
    date: 'May 12, 2026'
  },
  {
    id: 'r2',
    businessId: 'b1',
    userName: 'Stefan Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 4,
    comment: 'Top-tier setup, very quiet call booths. Deducted one star just because booking standard meeting rooms is highly competitive.',
    commentAr: 'تجهيزات عالية المستوى، غرف مكالمات هادئة للغاية. خصمت نجمة واحدة فقط لأن حجز غرف الاجتماعات التقليدية تنافسي وحرج للغاية.',
    commentKu: 'تەلارسازییەکی زۆر بەرز، ژوورەکانی تەلەفۆنی زۆر بێدەنگ. ئەستێرەیەکم کەم کردەوە تەنها بەهۆی ئەوەی حیجزکردنی ژوورەکانی کۆبوونەوە زۆر کێبڕکێی لەسەرە.',
    date: 'April 28, 2026'
  },
  {
    id: 'r3',
    businessId: 'b2',
    userName: 'Tariq Haddad',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'Culinary perfection. The modern twist on classic Hummus and Lamb shank was unforgettable. Perfect spot for critical business dinners.',
    commentAr: 'مثالية الطهي. اللمسة الحديثة للحمص الكلاسيكي وموزة الغنم لا تنسى. مكان ممتاز لعشاء العمل المهم.',
    commentKu: 'کەمالیەتی چێشتلێنان. تێکەڵکردنی مۆدێرن لەگەڵ حمص و بەرخ لێنراوی کلاسیک لەبیرنەکراو بوو. شوێنێکی ناوازەیە بۆ نانی ئێوارەی کاری گرنگ.',
    date: 'May 20, 2026'
  },
  {
    id: 'r4',
    businessId: 'b3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'High accuracy skincare and bespoke training schedules. The medical staff explains every biomarker testing result in spectacular clarity.',
    commentAr: 'عناية فائقة الدقة بالبشرة وبرامج تدريبية مخصصة. الطاقم الطبي يوضح كل نتيجة اختبار للمؤشرات الحيوية بوضوح مذهل.',
    commentKu: 'گرنگیدانی زۆر ورد بە پێست و خشتەی ڕاهێنانی تایبەت. ستافی پزیشکی هەموو ئەنجامێکی پشکنینەکان بە ڕوونی چاوەڕواننەکراو ڕوون دەکەنەوە.',
    date: 'May 06, 2026'
  }
];

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'i1',
    businessId: 'b1',
    businessName: 'The Foundry Coworking',
    senderName: 'Karim Zayed',
    senderEmail: 'karim@epicenter-ventures.xyz',
    message: 'Hello, we are looking to book a hot desk block for 15 engineers starting next month. Do you provide corporate bundles with custom bill structures?',
    date: '2026-05-25'
  },
  {
    id: 'i2',
    businessId: 'b1',
    businessName: 'The Foundry Coworking',
    senderName: 'Sarah Jenkins',
    senderEmail: 's.jenkins@futuredigital.net',
    message: 'Can we inquire about hosting a developer meetup of 40 people in the main event hall on a Thursday evening?',
    date: '2026-05-24'
  },
  {
    id: 'i3',
    businessId: 'b2',
    businessName: 'Saffron Artisanal Bistro',
    senderName: 'Nour El-Deen',
    senderEmail: 'nour@signaturelegal.ae',
    message: 'I would like to inquire about reserving the private room for 12 executive board members on May 30th. Can you share the set tasting menu options?',
    date: '2026-05-23'
  }
];

// Helper to calculate analytics for a business
const getMockAnalytics = (businessId: string): BusinessAnalytics => {
  const isB1 = businessId === 'b1' || businessId === 'all';
  return {
    views: isB1 ? [420, 580, 490, 620, 710, 850, 940] : [120, 150, 180, 210, 190, 280, 310],
    leads: isB1 ? [12, 19, 15, 23, 29, 34, 42] : [3, 5, 8, 4, 11, 15, 12],
    ratingDistribution: [
      { rating: 5, count: isB1 ? 110 : 25 },
      { rating: 4, count: isB1 ? 25 : 8 },
      { rating: 3, count: isB1 ? 5 : 2 },
      { rating: 2, count: isB1 ? 2 : 1 },
      { rating: 1, count: isB1 ? 0 : 0 }
    ],
    recentActivity: [
      {
        id: 'act1',
        type: 'lead',
        message: 'New corporate inquiry received from Karim Zayed.',
        messageAr: 'استفسار مشترك جديد تم تلقيه من كريم زايد.',
        time: '4 hours ago'
      },
      {
        id: 'act2',
        type: 'bookmark',
        message: 'A user bookmarked this business listing.',
        messageAr: 'قام أحد المستخدمين بوضع إشارة مرجعية لقائمتك.',
        time: '1 day ago'
      },
      {
        id: 'act3',
        type: 'view',
        message: 'Listing views spiked by 18% in the Silicon District segment.',
        messageAr: 'قفزت مشاهدات القائمة بنسبة ١٨٪ في قسم منطقة السيليكون.',
        time: '2 days ago'
      }
    ]
  };
};

// Simulated Local Storage fallback so state is persistent during the user session
let customBusinesses = [...MOCK_BUSINESSES];
let customReviews = [...MOCK_REVIEWS];
let customInquiries = [...MOCK_INQUIRIES];

// Delay simulator to mimic networking real-world conditions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const BusinessPortalAPI = {
  // Read List with full advanced local search, filtering, and simulated pagination
  async fetchBusinesses(
    filters: FilterState,
    pageOrParams: number | { page?: number; limit?: number; offset?: number } = 1,
    limitParam: number = 6
  ): Promise<{ data: Business[]; total: number; totalPages: number; page: number; limit: number; offset: number }> {
    await delay(350); // Real network simulation

    let page = 1;
    let limit = limitParam;
    let offset = 0;

    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      if (pageOrParams.limit !== undefined) {
        limit = pageOrParams.limit;
      }
      if (pageOrParams.offset !== undefined) {
        offset = pageOrParams.offset;
        page = Math.floor(offset / limit) + 1;
      } else if (pageOrParams.page !== undefined) {
        page = pageOrParams.page;
        offset = (page - 1) * limit;
      }
    } else if (typeof pageOrParams === 'number') {
      page = pageOrParams;
      offset = (page - 1) * limit;
    }

    let filtered = [...customBusinesses];

    // 1. Text Search matching English, Arabic or Kurdish tags
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.nameAr.toLowerCase().includes(q) ||
          (b.nameKu && b.nameKu.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q) ||
          b.descriptionAr.toLowerCase().includes(q) ||
          (b.descriptionKu && b.descriptionKu.toLowerCase().includes(q)) ||
          b.category.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.locationAr.toLowerCase().includes(q) ||
          (b.locationKu && b.locationKu.toLowerCase().includes(q))
      );
    }

    // 2. Category matching
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((b) => b.category === filters.category);
    }

    // 3. Location matching
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter((b) => b.location === filters.location);
    }

    // 4. Price range lists
    if (filters.priceLevels.length > 0) {
      filtered = filtered.filter((b) => filters.priceLevels.includes(b.priceLevel));
    }

    // 5. Min ratings
    if (filters.minRating > 0) {
      filtered = filtered.filter((b) => b.rating >= filters.minRating);
    }

    // 6. Verification Status check
    if (filters.isVerified) {
      filtered = filtered.filter((b) => b.isVerified);
    }

    // 7. Instant open check
    if (filters.isOpenNow) {
      filtered = filtered.filter((b) => b.isOpenNow);
    }

    // 8. Sorting
    if (filters.sortBy === 'highest_rated') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'relevance' && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const getRelevanceScore = (b: Business) => {
        let score = 0;
        if (b.name.toLowerCase() === q || b.nameAr.toLowerCase() === q || (b.nameKu && b.nameKu.toLowerCase() === q)) {
          score += 100;
        } else if (b.name.toLowerCase().startsWith(q) || b.nameAr.toLowerCase().startsWith(q)) {
          score += 50;
        } else if (b.name.toLowerCase().includes(q) || b.nameAr.toLowerCase().includes(q)) {
          score += 20;
        }
        if (b.description.toLowerCase().includes(q) || b.descriptionAr.toLowerCase().includes(q)) {
          score += 5;
        }
        if (b.isFeatured) {
          score += 2;
        }
        return score;
      };
      filtered.sort((a, b) => getRelevanceScore(b) - getRelevanceScore(a));
    } else {
      // 'newest' (ID-based, higher number is newer)
      filtered.sort((a, b) => {
        const idA = parseInt(a.id.replace(/\D/g, '')) || 0;
        const idB = parseInt(b.id.replace(/\D/g, '')) || 0;
        return idB - idA;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    if (offset < 0) offset = 0;
    const startIndex = offset;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      totalPages: totalPages || 1,
      page: Math.max(1, page),
      limit,
      offset
    };
  },

  // Fetch individual item details
  async fetchBusinessById(id: string): Promise<Business | null> {
    await delay(200);
    const b = customBusinesses.find((item) => item.id === id);
    return b || null;
  },

  // Add a new review to state
  async submitReview(businessId: string, authorName: string, rating: number, comment: string): Promise<Review> {
    await delay(400);
    const newReview: Review = {
      id: `rc_${Date.now()}`,
      businessId,
      userName: authorName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    customReviews.unshift(newReview);

    // Dynamic rating adjustment for listing
    const targetBusiness = customBusinesses.find((b) => b.id === businessId);
    if (targetBusiness) {
      const bReviews = customReviews.filter((r) => r.businessId === businessId);
      const avgRating = bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length;
      targetBusiness.rating = parseFloat(avgRating.toFixed(1));
      targetBusiness.reviewsCount = bReviews.length;
    }

    return newReview;
  },

  // Read reviews linked to a business
  async fetchReviews(businessId: string): Promise<Review[]> {
    await delay(150);
    return customReviews.filter((r) => r.businessId === businessId);
  },

  // Submit contact lead / inquiry
  async submitInquiry(businessId: string, senderName: string, senderEmail: string, message: string): Promise<Inquiry> {
    await delay(450);
    const targetB = customBusinesses.find((b) => b.id === businessId);
    const businessName = targetB ? targetB.name : 'Unknown Business';

    const newInquiry: Inquiry = {
      id: `inq_${Date.now()}`,
      businessId,
      businessName,
      senderName,
      senderEmail,
      message,
      date: new Date().toISOString().split('T')[0],
    };

    customInquiries.unshift(newInquiry);
    return newInquiry;
  },

  // Read leads for a specific business
  async fetchInquiries(businessId: string): Promise<Inquiry[]> {
    await delay(200);
    if (businessId === 'all') {
      return customInquiries;
    }
    return customInquiries.filter((i) => i.businessId === businessId);
  },

  // Read visual dashboard analytics datasets
  async fetchAnalytics(businessId: string): Promise<BusinessAnalytics> {
    await delay(250);
    return getMockAnalytics(businessId);
  },

  // Create standard new listing
  async createBusiness(businessData: Omit<Business, 'id' | 'rating' | 'reviewsCount' | 'isVerified'>): Promise<Business> {
    await delay(500);
    const newB: Business = {
      ...businessData,
      id: `b_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isVerified: false, // Moderated by default in production
    };

    customBusinesses.unshift(newB);
    return newB;
  },

  // Modify user-owned listing
  async updateBusiness(id: string, businessData: Partial<Business>): Promise<Business> {
    await delay(400);
    const index = customBusinesses.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error('Business not found');
    }

    customBusinesses[index] = {
      ...customBusinesses[index],
      ...businessData,
    };

    return customBusinesses[index];
  }
};
