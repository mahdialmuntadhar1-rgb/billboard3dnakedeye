const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'restaurant','cafe_bakery','supermarket','mall','pharmacy','hospital','clinic','doctor','dentist',
  'salon','spa','gym','hotel','travel_agency','university','bank','real_estate','lawyer',
  'car_dealer','car_rental','construction','logistics','advertising','marketing','technology','entertainment'
];
const GOVS = [
  'baghdad','basra','erbil','sulaymaniyah','najaf','mosul','karbala','kirkuk','anbar','duhok',
  'babil','diyala','wasit','saladin','maysan','dhiqar','muthanna','qadisiya','halabja'
];
const CITIES = {
  baghdad:['Baghdad','Sadr City','Karrada','Mansour'],basra:['Basra','Zubair','Umm Qasr'],
  erbil:['Erbil','Shaqlawa','Soran'],sulaymaniyah:['Sulaymaniyah','Halabja','Ranya'],
  najaf:['Najaf','Kufa'],mosul:['Mosul','Tel Afar','Hamdaniya'],karbala:['Karbala','Ain Al-Tamur'],
  kirkuk:['Kirkuk','Hawija'],anbar:['Ramadi','Fallujah','Haditha'],duhok:['Duhok','Amedi','Zakho'],
  babil:['Hillah','Musayyib'],diyala:['Baqubah','Muqdadiyah'],wasit:['Kut','Al-Hay'],
  saladin:['Tikrit','Samarra'],maysan:['Amarah','Ali Al-Gharbi'],dhiqar:['Nasiriyah','Suq Al-Shoyokh'],
  muthanna:['Samawah','Rumaitha'],qadisiya:['Diwaniyah','Afak'],halabja:['Halabja']
};
const FN=['Al-Mustafa','Al-Karim','Al-Rashid','Al-Nour','Al-Salam','Al-Yasmin','Al-Furat','Al-Tigris',
  'Al-Baghdadi','Al-Basri','Al-Erbili','Al-Najafi','Al-Mosuli','Golden','Royal','Modern','Elite','Prime','City','Downtown',
  'Sunrise','Star','Oasis','Paradise','Horizon','Skyline','Emerald','Diamond','Pearl','Imperial','Grand','Supreme','Premium','Classic','Heritage','National','Universal','Global'];
const SN=['Restaurant','Cafe','Hotel','Shop','Store','Market','Mall','Center','Clinic','Hospital','Pharmacy','Gym','Salon','Spa','Studio','Gallery','Agency','Company','Group','Corporation','Enterprise','Solutions','Services','Consultants','Traders','Contractors','Builders','Developers','Logistics','Shipping','Transport','Travel','Tourism','Events','Media','Advertising','Digital','Tech','IT','Systems','Networks','Electronics','Mobile','Auto','Cars','Motors','Garage','Workshop','Bakery','Sweets','Catering','Delivery','Coffee','Tea','Juice','Furniture','Decor','Design','Fashion','Boutique','Jewelry','Watches','Books','Library','Stationery','Printing','Photography','Music','Cinema','Games','Sports','Equipment','Tools','Hardware','Plumbing','Electrical','Appliances','Real Estate','Property','Rentals','Cleaning','Security','Maintenance','Repair','Laundry','Tailor','Shoes','Bags'];

const rand=a=>a[Math.floor(Math.random()*a.length)];
const rInt=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
function esc(s){return s.replace(/'/g,"''");}

const TOTAL=8000;
const BATCH=100;
const outDir=path.join(__dirname,'..','seed-sql');
if(!fs.existsSync(outDir))fs.mkdirSync(outDir);

for(let b=0;b<TOTAL;b+=BATCH){
  const rows=[];
  for(let i=b;i<Math.min(b+BATCH,TOTAL);i++){
    const gov=rand(GOVS),city=rand(CITIES[gov]||['Baghdad']),cat=rand(CATEGORIES);
    const name=`${rand(FN)} ${rand(SN)}`;
    const id=`biz-${String(i+1).padStart(5,'0')}`;
    const now=new Date().toISOString();
    const rating=+(Math.random()*2+3).toFixed(1);
    const rc=rInt(0,500),views=rInt(10,5000),likes=rInt(0,1000),saves=rInt(0,500);
    const ver=Math.random()>0.7?1:0;
    const website=`https://${name.toLowerCase().replace(/\s+/g,'-')}.iq`;
    const email=`info@${name.toLowerCase().replace(/\s+/g,'')}.iq`;
    const phone=`+964-${rInt(1,9)}${rInt(0,9)}${rInt(0,9)}-${rInt(100,999)}-${rInt(1000,9999)}`;
    const mobile=`+964-7${rInt(5,9)}${rInt(0,9)}-${rInt(100,999)}-${rInt(1000,9999)}`;
    const addr=`${rInt(1,999)} ${rand(['Main St','Al-Rashid St','Karrada Ave','Al-Jamhuriya St','Al-Nidal St','Tahrir Square','Al-Mansour Blvd','Al-Sadoon St'])}, ${city}`;
    rows.push(`('${id}','${esc(name)}','${esc(name)} provides excellent ${cat.toLowerCase()} services in ${city}, Iraq.','${esc(name)} — your trusted partner in ${city}.','${cat}','${city}','${gov}','Iraq','${website}','${email}','${phone}','${mobile}','${esc(addr)}',${rating},${rc},${views},${likes},${saves},${ver},1,'${now}','${now}')`);
  }
  const sql=`INSERT INTO businesses (id,name,description,bio,category,city,governorate,country,website,email,phone,mobile,address,rating,review_count,views,likes,saves,verified,is_active,created_at,updated_at) VALUES\n${rows.join(',\n')}\nON CONFLICT(id) DO UPDATE SET name=excluded.name,description=excluded.description,category=excluded.category,city=excluded.city,governorate=excluded.governorate,rating=excluded.rating,updated_at=excluded.updated_at;\n`;
  fs.writeFileSync(path.join(outDir,`batch-${String((b/BATCH)+1).padStart(2,'0')}.sql`),sql);
  console.log(`Wrote batch ${(b/BATCH)+1} (${b+1}-${Math.min(b+BATCH,TOTAL)})`);
}
console.log(`Done: ${TOTAL} businesses in ${TOTAL/BATCH} files inside ${outDir}`);
