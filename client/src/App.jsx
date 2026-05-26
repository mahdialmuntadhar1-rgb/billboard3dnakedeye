import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import './App.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [selectedGovernorate, selectedCategory, searchTerm, businesses]);

  const fetchData = async () => {
    try {
      const [businessesRes, governoratesRes, categoriesRes] = await Promise.all([
        axios.get('/api/businesses'),
        axios.get('/api/governorates'),
        axios.get('/api/categories')
      ]);

      setBusinesses(businessesRes.data.data);
      setGovernorates(governoratesRes.data.data);
      setCategories(categoriesRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];

    if (selectedGovernorate !== 'all') {
      filtered = filtered.filter(b => 
        b.governorate.toLowerCase() === selectedGovernorate.toLowerCase()
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => 
        b.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchLower) ||
        b.address.toLowerCase().includes(searchLower) ||
        b.bio.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBusinesses(filtered);
  };

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
  };

  const businessesWithCoords = filteredBusinesses.filter(b => b.latitude && b.longitude);

  return (
    <div className="app">
      <header className="header">
        <h1>🇮🇶 Iraq Businesses Dashboard</h1>
        <p className="subtitle">Explore {businesses.length} businesses across Iraq</p>
      </header>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Governorates</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map View
          </button>
        </div>
      </div>

      <div className="stats">
        <span className="stat">Showing {filteredBusinesses.length} businesses</span>
        <span className="stat">
          {businessesWithCoords.length} with coordinates
        </span>
      </div>

      {loading ? (
        <div className="loading">Loading businesses...</div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="businesses-list">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="business-card"
                  onClick={() => handleBusinessClick(business)}
                >
                  <div className="business-header">
                    <h3 className="business-name">{business.name}</h3>
                    <span className="business-category">{business.category}</span>
                  </div>
                  <div className="business-info">
                    <p className="business-governorate">📍 {business.governorate}</p>
                    <p className="business-address">{business.address}</p>
                    {business.phone && (
                      <p className="business-phone">📞 {business.phone}</p>
                    )}
                    {business.whatsapp && (
                      <p className="business-whatsapp">💬 {business.whatsapp}</p>
                    )}
                    {business.email && (
                      <p className="business-email">✉️ {business.email}</p>
                    )}
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="business-website"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                  <p className="business-bio">{business.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-container">
              <MapContainer
                center={[33.3152, 44.3661]} // Center of Iraq
                zoom={6}
                style={{ height: '600px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {businessesWithCoords.map((business) => (
                  <Marker
                    key={business.id}
                    position={[business.latitude, business.longitude]}
                  >
                    <Popup>
                      <div className="map-popup">
                        <h4>{business.name}</h4>
                        <p>{business.category}</p>
                        <p>{business.address}</p>
                        {business.phone && <p>📞 {business.phone}</p>}
                        {business.whatsapp && <p>💬 {business.whatsapp}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </>
      )}

      {selectedBusiness && (
        <div className="modal" onClick={() => setSelectedBusiness(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedBusiness(null)}
            >
              ×
            </button>
            <h2>{selectedBusiness.name}</h2>
            <p className="modal-category">{selectedBusiness.category}</p>
            <div className="modal-details">
              <p><strong>Governorate:</strong> {selectedBusiness.governorate}</p>
              <p><strong>Address:</strong> {selectedBusiness.address}</p>
              {selectedBusiness.phone && <p><strong>Phone:</strong> {selectedBusiness.phone}</p>}
              {selectedBusiness.mobile && <p><strong>Mobile:</strong> {selectedBusiness.mobile}</p>}
              {selectedBusiness.whatsapp && <p><strong>WhatsApp:</strong> {selectedBusiness.whatsapp}</p>}
              {selectedBusiness.email && <p><strong>Email:</strong> {selectedBusiness.email}</p>}
              {selectedBusiness.website && (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer">
                    {selectedBusiness.website}
                  </a>
                </p>
              )}
              {selectedBusiness.facebook && (
                <p>
                  <strong>Facebook:</strong>{' '}
                  <a href={selectedBusiness.facebook} target="_blank" rel="noopener noreferrer">
                    {selectedBusiness.facebook}
                  </a>
                </p>
              )}
              {selectedBusiness.instagram && (
                <p>
                  <strong>Instagram:</strong>{' '}
                  <a href={selectedBusiness.instagram} target="_blank" rel="noopener noreferrer">
                    {selectedBusiness.instagram}
                  </a>
                </p>
              )}
              <p className="modal-bio">{selectedBusiness.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
