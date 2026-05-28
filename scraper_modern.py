#!/usr/bin/env python3
import requests
import csv
import json
import time
from datetime import datetime
from pathlib import Path
from typing import List, Dict

GOOGLE_MAPS_API_KEY = ""
OSM_OVERPASS_URL = "https://overpass-api.de/api/interpreter"

CATEGORIES = [
    "restaurant", "cafe & bakery", "supermarket", "mall", "pharmacy",
    "hospital", "clinic", "doctor", "dentist", "salon", "spa", "gym",
    "hotel", "travel_agency", "university", "bank", "real_estate",
    "lawyer", "car_dealer", "car_rental", "mobile_shop", "furniture",
    "clothing_store", "software_company", "marketing_agency", "construction_company",
    "architecture", "photography", "cinema", "gaming_center", "sports_club", "pet_shop"
]

GOVERNORATES = {
    "Baghdad": (33.3128, 44.3615),
    "Basra": (30.5433, 47.7979),
    "Nineveh": (36.3539, 43.1581),
    "Kirkuk": (35.4689, 44.3882),
    "Diyala": (34.1964, 45.6214),
    "Anbar": (33.8547, 42.3567),
    "Karbala": (32.5086, 44.0055),
    "Najaf": (31.9454, 44.3569),
    "Maysan": (31.9454, 47.1639),
    "Muthanna": (31.7275, 45.3608),
    "Qadisiyyah": (32.1930, 45.7089),
    "Babil": (32.7341, 44.5882),
    "Wasit": (32.5141, 46.3503),
    "Erbil": (36.1912, 44.0091),
    "Sulaymaniyah": (35.5607, 46.4384),
    "Dohuk": (36.8746, 43.0026),
    "Halabja": (35.1869, 45.9833),
    "Saladin": (34.7625, 43.7898),
    "Tikrit": (34.6081, 43.6793),
}

OSM_TAGS = {
    "restaurant": ["restaurant"],
    "cafe & bakery": ["cafe", "bakery"],
    "supermarket": ["supermarket"],
    "mall": ["mall", "shopping_centre"],
    "pharmacy": ["pharmacy"],
    "hospital": ["hospital"],
    "clinic": ["clinic"],
    "doctor": ["doctors"],
    "dentist": ["dentist"],
    "salon": ["beauty", "hairdresser"],
    "spa": ["spa"],
    "gym": ["gym", "fitness_centre"],
    "hotel": ["hotel", "hostel"],
    "travel_agency": ["travel_agency"],
    "university": ["university"],
    "bank": ["bank"],
    "real_estate": ["estate_agent"],
    "lawyer": ["lawyer"],
    "car_dealer": ["car_dealer"],
    "car_rental": ["car_rental"],
    "mobile_shop": ["mobile_phone"],
    "furniture": ["furniture"],
    "clothing_store": ["clothes"],
    "software_company": ["software"],
    "marketing_agency": ["advertising"],
    "construction_company": ["construction"],
    "architecture": ["architect"],
    "photography": ["photography"],
    "cinema": ["cinema"],
    "gaming_center": ["arcade"],
    "sports_club": ["sports_centre"],
    "pet_shop": ["pet_shop"],
}

class ModernScraper:
    def __init__(self, api_key=""):
        self.api_key = api_key
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_file = Path(f"iraq_businesses_{self.timestamp}.csv")
        self.fieldnames = ['id', 'name', 'category', 'governorate', 'address', 'phone', 'email', 'website', 'latitude', 'longitude', 'source', 'rating', 'review_count']
        self.total = 0

    def query_osm(self, gov, lat, lon, osm_tags, limit=10):
        if not osm_tags:
            return []
        tag_conditions = " OR ".join([f'["amenity"="{t}"]' for t in osm_tags])
        query = f"[bbox:{lat-0.5},{lon-0.5},{lat+0.5},{lon+0.5}];(node{tag_conditions};way{tag_conditions};);out center;"
        try:
            response = requests.post(OSM_OVERPASS_URL, data=query, timeout=30)
            if response.status_code == 200:
                data = response.json()
                businesses = []
                for elem in data.get('elements', [])[:limit]:
                    tags = elem.get('tags', {})
                    if 'center' in elem:
                        lat_val, lon_val = elem['center']['lat'], elem['center']['lon']
                        business = {'id': f"osm_{elem.get('id')}", 'name': tags.get('name', 'Unknown'), 'category': 'pending', 'governorate': gov, 'address': tags.get('addr:street', ''), 'phone': tags.get('phone', ''), 'email': tags.get('email', ''), 'website': tags.get('website', ''), 'latitude': round(lat_val, 4), 'longitude': round(lon_val, 4), 'source': 'OSM', 'rating': '', 'review_count': ''}
                        businesses.append(business)
                return businesses[:limit]
        except:
            pass
        return []

    def scrape_batch(self, gov, category):
        osm_tags = OSM_TAGS.get(category, [])
        osm_data = self.query_osm(gov, *GOVERNORATES[gov], osm_tags, limit=10)
        for item in osm_data:
            item['category'] = category
        return osm_data[:10]

    def save_batch(self, businesses):
        if not businesses:
            return
        if not self.output_file.exists():
            with open(self.output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=self.fieldnames)
                writer.writeheader()
                writer.writerows(businesses)
        else:
            with open(self.output_file, 'a', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=self.fieldnames)
                writer.writerows(businesses)
        self.total += len(businesses)

    def run(self):
        print(f"\n{'='*70}\n🚀 MODERN IRAQ SCRAPER 2026\n{'='*70}\nExpected: {len(GOVERNORATES) * len(CATEGORIES) * 10:,}\n{'='*70}\n")
        for gov in GOVERNORATES.keys():
            print(f"📍 {gov}")
            for category in CATEGORIES:
                batch = self.scrape_batch(gov, category)
                self.save_batch(batch)
                print(f"  ✓ {category:25} {len(batch):2}/10 (total: {self.total:,})")
                time.sleep(0.3)
        print(f"\n✅ Complete: {self.total:,} saved to {self.output_file}\n")

scraper = ModernScraper()
scraper.run()
