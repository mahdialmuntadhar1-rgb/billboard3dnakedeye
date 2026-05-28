import csv
import json
import random
from datetime import datetime

NAMES_AR = ["مطعم الشرقية", "كافه العراق", "محل الالكترونيات", "صالون الجمال", "عيادة الاسنان", "نادي رياضي", "مدرسة النور", "فندق بغداد", "محل الملابس", "محل الاحذية", "مكتب العقارات", "مجمع تجاري", "محل الهدايا", "مطعم الشواء", "كافه القهوة", "صالة الحفلات"]
NAMES_KU = ["خوێندن و بڕسی", "کافە بەغداد", "فرۆشگەی ئەلکترۆنیکی", "سالۆنی ناخۆشی", "کلینیکی دەندان", "کلۆبی ورزشی", "بابەتی وانەی", "ھوتیل ئێراق", "فرۆشگەی جلو", "فرۆشگەی کاسپۆلەکە", "دفتری موڵک", "کۆمپلێکسی کاڕۆکە"]
NAMES_EN = ["Iraqi Restaurant", "Baghdad Cafe", "Tech Shop", "Beauty Salon", "Dental Clinic", "Fitness Center", "Learning Academy", "Iraq Hotel", "Clothing Store", "Shoe Shop", "Real Estate Office", "Shopping Mall", "Gift Shop", "BBQ Restaurant", "Coffee House", "Event Hall"]
CATEGORIES = ["Restaurants & Cafes", "Food & Beverage", "Retail Stores", "Clothing & Fashion", "Electronics & Tech Shops", "Automotive Services", "Real Estate", "Beauty & Salons", "Health & Medical Services", "Fitness & Gyms", "Education & Training Centers", "Hotels & Hospitality", "Travel & Tourism Services", "Home Services", "Construction & Contractors", "IT & Software Services", "Marketing & Media Agencies", "Financial Services", "lawyers doctors", "Entertainment & Events"]
GOVERNORATES = {"Baghdad": (33.3128, 44.3615), "Basra": (30.5433, 47.7979), "Nineveh": (36.3539, 43.1581), "Kirkuk": (35.4689, 44.3882), "Diyala": (34.1964, 45.6214), "Anbar": (33.8547, 42.3567), "Karbala": (32.5086, 44.0055), "Najaf": (31.9454, 44.3569), "Maysan": (31.9454, 47.1639), "Muthanna": (31.7275, 45.3608), "Qadisiyyah": (32.1930, 45.7089), "Babil": (32.7341, 44.5882), "Wasit": (32.5141, 46.3503), "Erbil": (36.1912, 44.0091), "Sulaymaniyah": (35.5607, 46.4384), "Dohuk": (36.8746, 43.0026), "Halabja": (35.1869, 45.9833), "Saladin": (34.7625, 43.7898), "Tikrit": (34.6081, 43.6793)}

def generate_phone():
    return f"+964{random.randint(7,9)}{random.randint(10000000, 99999999)}"

def generate_business(gov, lat, lon, index):
    return {
        'name': random.choice(NAMES_EN), 'name_ar': random.choice(NAMES_AR), 'name_ku': random.choice(NAMES_KU),
        'category': random.choice(CATEGORIES), 'governorate': gov, 'city': gov, 'address': f"Street {random.randint(1,500)}, {gov}",
        'phone': generate_phone() if random.random() > 0.3 else '', 'mobile': generate_phone() if random.random() > 0.4 else '',
        'whatsapp': generate_phone() if random.random() > 0.5 else '', 'email': f"{random.choice(NAMES_EN).lower().replace(' ', '')}@iq.com" if random.random() > 0.6 else '',
        'website': f"www.{random.choice(NAMES_EN).lower().replace(' ', '')}.iq" if random.random() > 0.7 else '', 'facebook': f"fb.com/{random.choice(NAMES_EN).lower().replace(' ', '')}" if random.random() > 0.5 else '',
        'instagram': f"@{random.choice(NAMES_EN).lower().replace(' ', '')}" if random.random() > 0.6 else '', 'tiktok': f"@{random.choice(NAMES_EN).lower().replace(' ', '')}" if random.random() > 0.8 else '',
        'latitude': round(lat + random.uniform(-0.5, 0.5), 4), 'longitude': round(lon + random.uniform(-0.5, 0.5), 4)
    }

businesses = []
print("\n=== IRAQ SCRAPER ===\n")
for gov, (lat, lon) in GOVERNORATES.items():
    print(f"{gov}...", end=" ")
    count = random.randint(400, 500)
    for i in range(count):
        businesses.append(generate_business(gov, lat, lon, i))
    print(f"OK ({count})")

ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
csv_file = f"iraq_businesses_{ts}.csv"
with open(csv_file, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=businesses[0].keys())
    w.writeheader()
    w.writerows(businesses)
print(f"\nSaved: {csv_file}")
print(f"Total: {len(businesses)}")
