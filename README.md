# Iraq Businesses Dashboard

A comprehensive web dashboard for exploring 8,502+ Iraqi businesses with interactive map view, search, and filtering capabilities.

## Features

- 📊 **8,502+ Business Records** - Comprehensive database of Iraqi businesses
- 🗺️ **Interactive Map View** - Visualize businesses on a map using lat/lon coordinates
- 🔍 **Advanced Search** - Search by name, address, or bio
- 🏛️ **Governorate Filter** - Filter by Iraqi governorates
- 📂 **Category Filter** - Filter by business categories
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## Tech Stack

### Backend
- Node.js/Express
- CSV Parser for data import
- RESTful API

### Frontend
- React 18
- Vite
- React Leaflet (Map integration)
- Axios (API calls)
- CSS3 with responsive design

## Project Structure

```
iraq-businesses-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Express backend
│   └── index.js          # API server
├── scripts/               # Utility scripts
│   └── import-csv.js     # CSV import script
├── data/                  # Data directory (auto-created)
│   └── businesses.json   # Imported business data
├── iraq_businesses_*.csv # Source CSV file
└── package.json          # Root dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
```bash
cd iraq-businesses-dashboard
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Install client dependencies:**
```bash
cd client
npm install
cd ..
```

4. **Import CSV data:**
```bash
npm run import-data
```

This will:
- Read the CSV file
- Convert it to JSON format
- Save it to `data/businesses.json`
- Display import statistics

### Running the Application

#### Development Mode (Both servers)
```bash
npm run dev
```
This starts both the backend (port 5000) and frontend (port 3000) simultaneously.

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Get All Businesses
```
GET /api/businesses
Query Params:
  - governorate: Filter by governorate
  - category: Filter by category
  - search: Search term
```

### Get Governorates
```
GET /api/governorates
```

### Get Categories
```
GET /api/categories
```

### Get Business by ID
```
GET /api/businesses/:id
```

### Health Check
```
GET /api/health
```

## Usage

### Search and Filter
1. Use the search box to find businesses by name, address, or bio
2. Select a governorate from the dropdown to filter by region
3. Select a category to filter by business type
4. Toggle between List View and Map View

### Map View
- Click on markers to see business details
- Zoom in/out to explore different regions
- Markers show businesses with valid coordinates

### Business Details
- Click on any business card to view full details
- Modal shows contact information, social media links, and bio
- Click outside the modal or × to close

## Data Format

The CSV file should contain the following columns:
- name
- language
- category
- governorate
- address
- phone
- mobile
- whatsapp
- email
- website
- facebook
- instagram
- bio
- latitude
- longitude

## Customization

### Change API Port
Edit `server/index.js`:
```javascript
const PORT = process.env.PORT || 5000; // Change to desired port
```

### Change Frontend Port
Edit `client/vite.config.js`:
```javascript
server: {
  port: 3000, // Change to desired port
  // ...
}
```

### Update Map Center
Edit `client/src/App.jsx`:
```javascript
<MapContainer
  center={[33.3152, 44.3661]} // Change to desired center
  zoom={6} // Change zoom level
  // ...
>
```

## Troubleshooting

### CSV Import Fails
- Ensure the CSV file exists in the project root
- Check that the CSV has the correct column headers
- Verify the file path in `scripts/import-csv.js`

### Map Not Showing
- Ensure you have an internet connection (map tiles are loaded from OpenStreetMap)
- Check browser console for errors
- Verify that businesses have valid latitude/longitude coordinates

### API Not Responding
- Check that the backend server is running
- Verify the port is not in use by another application
- Check the API health endpoint: `http://localhost:5000/api/health`

## Performance

- The dashboard handles 8,502+ business records efficiently
- Map view only renders businesses with valid coordinates
- Client-side filtering for instant search results
- Lazy loading of map tiles

## License

MIT

## Credits

Built with ❤️ for the Iraqi business community
