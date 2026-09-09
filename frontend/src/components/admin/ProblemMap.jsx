import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

import { Link } from 'react-router-dom';
import api from '../../services/api';

import {
  FaSpinner,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaFire,
  FaLayerGroup
} from 'react-icons/fa';


// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',

  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});


// --------------------------------------------------
// Fit map to problem locations
// --------------------------------------------------

const FitBounds = ({ problems }) => {

  const map = useMap();

  useEffect(() => {

    const valid = problems.filter(
      p =>
        p.location &&
        typeof p.location.lat === 'number' &&
        typeof p.location.lng === 'number'
    );

    if (valid.length === 1) {

      map.setView(
        [valid[0].location.lat, valid[0].location.lng],
        14
      );

    } else if (valid.length > 1) {

      const bounds = L.latLngBounds(
        valid.map(p => [
          p.location.lat,
          p.location.lng
        ])
      );

      map.fitBounds(bounds, {
        padding: [50, 50]
      });

    }

  }, [problems, map]);

  return null;
};


// --------------------------------------------------
// Heatmap Layer
// --------------------------------------------------

const HeatmapLayer = ({ problems }) => {

  const map = useMap();

  useEffect(() => {

    const points = problems
      .filter(
        p =>
          p.location &&
          typeof p.location.lat === 'number' &&
          typeof p.location.lng === 'number'
      )
      .map(p => [
        p.location.lat,
        p.location.lng,
        1
      ]);

    if (points.length === 0) {
      return;
    }

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      max: 1,
      minOpacity: 0.4
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };

  }, [problems, map]);

  return null;
};


// --------------------------------------------------
// Main Component
// --------------------------------------------------

const ProblemMap = () => {

  const [problems, setProblems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [filter, setFilter] = useState({
    status: '',
    category: ''
  });

  const [showFilters, setShowFilters] =
    useState(false);

  const [mapMode, setMapMode] =
    useState('both');


  // --------------------------------------------------
  // Fetch Problems
  // --------------------------------------------------

  const fetchProblems = async () => {

    try {

      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (filter.status) {
        params.append('status', filter.status);
      }

      if (filter.category) {
        params.append('category', filter.category);
      }

      const response = await api.get(
        `/api/admin/problems?${params.toString()}`
      );

      if (response.data?.success) {

        const data = response.data.data;

        /*
          Backend pagination response is usually:

          response.data.data.data

          But we support multiple possible structures.
        */

        const allProblems =
          data?.data ||
          data?.problems ||
          data?.results ||
          [];

        const validProblems =
          Array.isArray(allProblems)
            ? allProblems.filter(
                p =>
                  p.location &&
                  typeof p.location.lat === 'number' &&
                  typeof p.location.lng === 'number'
              )
            : [];

        setProblems(validProblems);

      } else {

        setProblems([]);

      }

    } catch (err) {

      console.error('Problem map error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load problem locations.'
      );

      setProblems([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchProblems();

  }, [filter.status, filter.category]);


  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const handleFilter = (type, value) => {

    setFilter(prev => ({
      ...prev,
      [type]: value === 'All' ? '' : value
    }));

  };


  const clearFilters = () => {

    setFilter({
      status: '',
      category: ''
    });

    setShowFilters(false);

  };


  const statuses = [
    'All',
    'Pending',
    'Under Review',
    'In Progress',
    'Solved',
    'Rejected'
  ];


  const categories = [
    'All',
    'Roads',
    'Water',
    'Electricity',
    'Sanitation',
    'Healthcare',
    'Education',
    'Transport',
    'Housing',
    'Environment',
    'Other'
  ];


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center">

        <div className="text-center">

          <FaSpinner
            className="animate-spin text-4xl text-[#D4A09A] mx-auto mb-4"
          />

          <p className="text-gray-500">
            Loading problem map...
          </p>

        </div>

      </div>
    );
  }


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="space-y-4">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div>

          <h2 className="text-2xl font-bold text-gray-700">
            Problem Map
          </h2>

          <p className="text-sm text-gray-400">
            {problems.length} problems with location data
          </p>

        </div>


        <div className="flex gap-2">

          {/* Map Mode */}

          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">

            <button
              onClick={() => setMapMode('markers')}
              className={`px-3 py-2 flex items-center gap-2 text-sm ${
                mapMode === 'markers'
                  ? 'bg-[#D4A09A] text-white'
                  : 'text-gray-600'
              }`}
            >
              <FaMapMarkerAlt />
              Markers
            </button>


            <button
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-2 flex items-center gap-2 text-sm ${
                mapMode === 'heatmap'
                  ? 'bg-[#D4A09A] text-white'
                  : 'text-gray-600'
              }`}
            >
              <FaFire />
              Heatmap
            </button>


            <button
              onClick={() => setMapMode('both')}
              className={`px-3 py-2 flex items-center gap-2 text-sm ${
                mapMode === 'both'
                  ? 'bg-[#D4A09A] text-white'
                  : 'text-gray-600'
              }`}
            >
              <FaLayerGroup />
              Both
            </button>

          </div>


          {/* Filter Button */}

          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>

        </div>

      </div>


      {/* Filters */}

      {showFilters && (

        <div className="bg-white rounded-xl border p-4">

          <div className="flex justify-between mb-4">

            <h3 className="font-semibold">
              Filter Problems
            </h3>

            <button
              onClick={clearFilters}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <FaTimes />
              Clear
            </button>

          </div>


          <div className="flex flex-wrap gap-3">

            <select
              value={filter.status || 'All'}
              onChange={(e) =>
                handleFilter(
                  'status',
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-2"
            >

              {statuses.map(status => (

                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>

              ))}

            </select>


            <select
              value={filter.category || 'All'}
              onChange={(e) =>
                handleFilter(
                  'category',
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-2"
            >

              {categories.map(category => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              ))}

            </select>

          </div>

        </div>

      )}


      {/* Error */}

      {error && (

        <div className="bg-red-50 text-red-600 p-4 rounded-xl">
          {error}
        </div>

      )}


      {/* Map */}

      <div className="rounded-xl overflow-hidden border border-gray-200 h-[600px]">

        {problems.length === 0 ? (

          <div className="flex items-center justify-center h-full bg-gray-50">

            <div className="text-center">

              <FaMapMarkerAlt className="text-4xl text-gray-300 mx-auto mb-3" />

              <p className="text-gray-500 text-lg">
                No problems with location data
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Problems containing latitude and longitude
                will appear here.
              </p>

            </div>

          </div>

        ) : (

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{
              height: '100%',
              width: '100%'
            }}
          >

            <FitBounds problems={problems} />


            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {/* Heatmap */}

            {(mapMode === 'heatmap' ||
              mapMode === 'both') && (

              <HeatmapLayer
                problems={problems}
              />

            )}


            {/* Markers */}

            {(mapMode === 'markers' ||
              mapMode === 'both') && (

              problems.map(problem => (

                <Marker
                  key={problem._id}
                  position={[
                    problem.location.lat,
                    problem.location.lng
                  ]}
                >

                  <Popup>

                    <div className="min-w-[220px]">

                      <h3 className="font-bold text-gray-700">
                        {problem.title}
                      </h3>


                      <p className="text-sm text-gray-500 mt-2">
                        Category: {problem.category || '-'}
                      </p>


                      <p className="text-sm text-gray-500">
                        Status: {problem.status || '-'}
                      </p>


                      <p className="text-sm text-gray-500">
                        Priority: {problem.priority || '-'}
                      </p>


                      {problem.location.address && (

                        <p className="text-xs text-gray-400 mt-2">
                          📍 {problem.location.address}
                        </p>

                      )}


                      <Link
                        to={`/citizen/problem/${problem._id}`}
                        className="block mt-3 text-sm text-[#D4A09A] font-semibold"
                      >
                        View Problem →
                      </Link>

                    </div>

                  </Popup>

                </Marker>

              ))

            )}

          </MapContainer>

        )}

      </div>


      {/* Map Legend */}

      {problems.length > 0 && (

        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">

            <div className="flex items-center gap-2">

              <FaMapMarkerAlt className="text-[#D4A09A]" />

              <span>
                Individual Problems
              </span>

            </div>


            <div className="flex items-center gap-2">

              <FaFire className="text-orange-500" />

              <span>
                High Problem Concentration
              </span>

            </div>


            <div className="ml-auto font-semibold text-gray-700">

              Total: {problems.length}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ProblemMap;