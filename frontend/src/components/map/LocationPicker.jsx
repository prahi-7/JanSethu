import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { FaSearch, FaSpinner } from 'react-icons/fa';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const selectedIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationSelector = ({ onLocationSelect }) => {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      onLocationSelect({ lat, lng });
    }
  });

  return null;
};

const MapController = ({ position, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    const lat = Number(position.lat);
    const lng = Number(position.lng);

    if (isNaN(lat) || isNaN(lng)) return;

    map.flyTo([lat, lng], zoom, {
      duration: 1.2
    });
  }, [position, zoom, map]);

  return null;
};

const geocodeAddress = async (address) => {
  const url =
    'https://nominatim.openstreetmap.org/search?' +
    `q=${encodeURIComponent(address)}` +
    '&format=json' +
    '&addressdetails=1' +
    '&limit=5';

  console.log('🌐 Geocoding URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  const data = await response.json();

  console.log('📍 Nominatim response:', data);

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const result = data.find(
    (item) =>
      item.lat &&
      item.lon &&
      !isNaN(parseFloat(item.lat)) &&
      !isNaN(parseFloat(item.lon))
  );

  if (!result) return null;

  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    displayName: result.display_name
  };
};

const reverseGeocode = async (lat, lng) => {
  try {
    const url =
      'https://nominatim.openstreetmap.org/reverse?' +
      `lat=${lat}&lon=${lng}` +
      '&format=json&addressdetails=1';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    return data?.display_name || '';
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    return '';
  }
};

const LocationPicker = ({
  initialLocation,
  onLocationSelect,
  height = '400px',
  zoom = 14,
  className = '',
  showSearch = true
}) => {
  const defaultLocation = {
    lat: 28.6139,
    lng: 77.2090
  };

  const initialLat = !isNaN(parseFloat(initialLocation?.lat))
    ? parseFloat(initialLocation.lat)
    : defaultLocation.lat;

  const initialLng = !isNaN(parseFloat(initialLocation?.lng))
    ? parseFloat(initialLocation.lng)
    : defaultLocation.lng;

  const [position, setPosition] = useState({
    lat: initialLat,
    lng: initialLng
  });

  const [address, setAddress] = useState(
    initialLocation?.address || ''
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    if (!initialLocation) return;

    const lat = parseFloat(initialLocation.lat);
    const lng = parseFloat(initialLocation.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition({ lat, lng });

      if (initialLocation.address) {
        setAddress(initialLocation.address);
      }
    }
  }, [initialLocation]);

  const updatePosition = (lat, lng, locationAddress = '') => {
    const newLat = Number(lat);
    const newLng = Number(lng);

    if (isNaN(newLat) || isNaN(newLng)) {
      console.error('❌ Invalid coordinates:', lat, lng);
      return;
    }

    const newLocation = {
      lat: newLat,
      lng: newLng,
      address: locationAddress
    };

    setPosition({
      lat: newLat,
      lng: newLng
    });

    if (locationAddress) {
      setAddress(locationAddress);
    }

    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }

    if (mapRef.current) {
      mapRef.current.flyTo(
        [newLat, newLng],
        17,
        { duration: 1.2 }
      );
    }
  };

  const handleSearch = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    const query = searchQuery.trim();

    console.log('🔎 Searching address:', query);

    if (!query) {
      toast.error('Please enter an address.');
      return;
    }

    setSearchLoading(true);
    setError('');

    try {
      const result = await geocodeAddress(query);

      console.log('📍 Search result:', result);

      if (!result) {
        toast.error(
          'Address not found. Try adding city, state and country.'
        );
        return;
      }

      const lat = Number(result.lat);
      const lng = Number(result.lng);

      console.log('🗺️ Coordinates found:', lat, lng);

      setPosition({
        lat,
        lng
      });

      setAddress(result.displayName);

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address: result.displayName
        });
      }

      if (mapRef.current) {
        console.log(
          '🗺️ Moving map to:',
          lat,
          lng
        );

        mapRef.current.flyTo(
          [lat, lng],
          17,
          { duration: 1.5 }
        );
      }

      toast.success('📍 Location found on the map!');
    } catch (err) {
      console.error('❌ Address search error:', err);

      setError('Unable to search this address.');

      toast.error(
        'Failed to search address. Please try again.'
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const getUserLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      const message =
        'Geolocation is not supported by your browser.';

      setError(message);
      setIsLoading(false);
      toast.error(message);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        console.log(
          '📍 Current coordinates:',
          lat,
          lng
        );

        let detectedAddress = '';

        try {
          detectedAddress = await reverseGeocode(
            lat,
            lng
          );
        } catch (error) {
          console.error(
            'Reverse geocoding failed:',
            error
          );
        }

        updatePosition(
          lat,
          lng,
          detectedAddress || 'Current Location'
        );

        toast.success(
          '📍 Current location captured!'
        );

        setIsLoading(false);
      },
      (err) => {
        console.error(
          '❌ Geolocation error:',
          err
        );

        let message =
          'Unable to get your current location.';

        if (err.code === 1) {
          message =
            'Location permission denied. Please allow location access.';
        } else if (err.code === 2) {
          message =
            'Location unavailable. Please select a location on the map.';
        } else if (err.code === 3) {
          message =
            'Location request timed out. Please try again.';
        }

        setError(message);
        toast.error(message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const handleMapLocationSelect = async (location) => {
    const lat = Number(location.lat);
    const lng = Number(location.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    setPosition({
      lat,
      lng
    });

    let clickedAddress = '';

    try {
      clickedAddress = await reverseGeocode(
        lat,
        lng
      );
    } catch (error) {
      console.error(
        'Reverse geocoding error:',
        error
      );
    }

    setAddress(clickedAddress);

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: clickedAddress
      });
    }

    toast.success(
      '📍 Location selected!'
    );
  };

  return (
    <div className={`relative ${className}`}>

      {showSearch && (
        <div className="mb-3">

          <div className="flex gap-2">

            <div className="flex-1 relative">

              <FaSearch
                className="
                  absolute left-3 top-1/2
                  transform -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                placeholder="Search for an address"
                className="
                  w-full pl-9 pr-4 py-2.5
                  bg-white border border-gray-200
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-pink-400
                  text-gray-700 text-sm
                "
              />

            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={searchLoading}
              className="
                px-4 py-2.5
                bg-gradient-to-r
                from-[#FFCABE] to-[#E8B5A9]
                text-white rounded-xl
                hover:shadow-lg
                transition-all
                disabled:opacity-50
                flex items-center gap-2
                text-sm
              "
            >
              {searchLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSearch />
              )}

              {searchLoading
                ? 'Searching...'
                : 'Search'}
            </button>

          </div>

          <p className="text-xs text-gray-400 mt-1">
            Enter an address and click Search to locate it on the map.
          </p>

        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">

        <button
          type="button"
          onClick={getUserLocation}
          disabled={isLoading}
          className="
            px-4 py-2
            bg-green-50 text-green-600
            rounded-lg
            hover:bg-green-100
            transition-colors
            flex items-center gap-2
            text-sm disabled:opacity-50
          "
        >
          <span className="text-lg">📍</span>

          {isLoading
            ? 'Getting location...'
            : 'Use Current Location'}
        </button>

        {error && (
          <span className="text-xs text-red-500 self-center">
            {error}
          </span>
        )}

      </div>

      <div
        style={{
          height,
          width: '100%'
        }}
        className="
          rounded-xl
          overflow-hidden
          border border-gray-200
        "
      >

        <MapContainer
          center={[
            position.lat,
            position.lng
          ]}
          zoom={zoom}
          style={{
            height: '100%',
            width: '100%'
          }}
          className="z-0"
          zoomControl={true}
          attributionControl={true}
          ref={(map) => {
            mapRef.current = map;
          }}
        >

          <MapController
            position={position}
            zoom={17}
          />

          <LocationSelector
            onLocationSelect={
              handleMapLocationSelect
            }
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[
              position.lat,
              position.lng
            ]}
            icon={selectedIcon}
          />

        </MapContainer>

      </div>

      <div className="
        mt-2
        flex flex-wrap
        gap-4
        text-xs
        text-gray-500
      ">
        <span>
          Lat: {position.lat.toFixed(6)}
        </span>

        <span>
          Lng: {position.lng.toFixed(6)}
        </span>

        {address && (
          <span className="
            text-gray-400
            truncate
            max-w-full
          ">
            📍 {address}
          </span>
        )}
      </div>

    </div>
  );
};

export default LocationPicker;