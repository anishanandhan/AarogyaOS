import { useState, useEffect, useRef } from 'react';
import { centres, ashaWorkers } from '../data/mockData';
import { MapPin, Activity, Heart, Users, CheckCircle, TrendingUp, Stethoscope, Layers, AlertTriangle, Satellite, Droplets, Sprout, Wind, Loader2, Cloud, Thermometer, Database } from 'lucide-react';
import { generateSatelliteHealthReport, getVelloreBounds } from '../services/earthEngine';
import usePublicData from '../hooks/usePublicData';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';

const centreLocations = {
  "phc-001": { lat: 12.9238, lng: 79.1900 },
  "phc-002": { lat: 12.9715, lng: 79.3100 },
  "chc-001": { lat: 12.9165, lng: 79.1325 },
  "phc-003": { lat: 12.9468, lng: 78.8682 },
  "phc-004": { lat: 12.9064, lng: 79.3333 },
  "phc-005": { lat: 12.9270, lng: 79.3327 },
  "phc-006": { lat: 12.9769, lng: 79.3582 },
  "chc-002": { lat: 12.9796, lng: 79.1375 }
};

// Premium dark mode maps theme
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0B1528" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B1528" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#74889B" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#A8B2C1" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8E9AA8" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0A1B29" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4E7E6B" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#162235" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0F1928" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#607185" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1D2F47" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#122033" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9FB3C8" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#060D1A" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3B4E64" }]
  }
];

export default function PublicHealthMapPage() {
  const { language } = useApp();
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [viewMode, setViewMode] = useState('markers'); // 'markers' or 'heatmap'
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [satelliteReport, setSatelliteReport] = useState(null);
  const [isLoadingSatellite, setIsLoadingSatellite] = useState(false);

  // Fetch live public data from government APIs
  const { data: publicData, loading: publicDataLoading, error: publicDataError, refetch: refetchPublicData } = usePublicData();

  // Load satellite analysis
  const handleLoadSatelliteAnalysis = async () => {
    setIsLoadingSatellite(true);
    try {
      const bounds = getVelloreBounds();
      const report = await generateSatelliteHealthReport('Vellore', bounds);
      setSatelliteReport(report);
    } catch (error) {
      console.error('[Earth Engine] Error:', error);
    } finally {
      setIsLoadingSatellite(false);
    }
  };

  // Calculate stats
  const totalHouseholds = ashaWorkers.reduce((sum, w) => sum + w.householdsAssigned, 0);
  const totalVisitsThisWeek = ashaWorkers.reduce((sum, w) => sum + w.visitsThisWeek, 0);
  const verifiedVisitsTotal = ashaWorkers.reduce((sum, w) => sum + w.verifiedVisits, 0);
  const uniqueVillages = [...new Set(ashaWorkers.map(w => w.village))];
  const totalVillages = uniqueVillages.length;
  const bedsTotal = centres.reduce((sum, c) => sum + c.bedsTotal, 0);
  const bedsOccupied = centres.reduce((sum, c) => sum + c.bedsOccupied, 0);
  const bedsAvailable = bedsTotal - bedsOccupied;

  // Block wise aggregations
  const blockStats = centres.reduce((acc, c) => {
    if (!acc[c.block]) {
      acc[c.block] = { name: c.block, centresCount: 0, avgScore: 0, totalScore: 0 };
    }
    acc[c.block].centresCount += 1;
    acc[c.block].totalScore += c.healthScore;
    acc[c.block].avgScore = Math.round(acc[c.block].totalScore / acc[c.block].centresCount);
    return acc;
  }, {});

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    setHasApiKey(!!apiKey && apiKey !== "your_maps_api_key_here");

    const scriptId = "google-maps-script";
    let activeMarkers = [];
    let activeHeatmap = null;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.94, lng: 79.13 }, // Vellore region centre
        zoom: 11,
        styles: darkMapStyle,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });

      const bounds = new window.google.maps.LatLngBounds();
      const infoWindow = new window.google.maps.InfoWindow();

      // Use live government facility data if available, otherwise fallback to mock data
      const facilities = (publicData?.healthFacilities && publicData.healthFacilities.length > 0)
        ? publicData.healthFacilities
        : centres;

      const isLiveData = publicData?.healthFacilities && publicData.healthFacilities.length > 0;

      if (viewMode === 'markers') {
        // Plot Markers from live government data
        facilities.forEach(facility => {
          // Use real GPS coordinates from API or fallback to hardcoded locations for mock data
          let loc;
          if (isLiveData) {
            // Live data has latitude/longitude fields
            if (facility.latitude && facility.longitude) {
              loc = { lat: facility.latitude, lng: facility.longitude };
            } else {
              // Skip facilities without GPS coordinates
              return;
            }
          } else {
            // Mock data uses centreLocations mapping
            loc = centreLocations[facility.id] || { lat: 12.94, lng: 79.13 };
          }

          bounds.extend(loc);

          // Color based on health score (mock data) or operational status (live data)
          let color;
          if (isLiveData) {
            // Green for operational facilities, gray for others
            color = facility.status === 'operational' ? "#10B981" : "#94A3B8";
          } else {
            color = facility.healthScore >= 70 ? "#10B981" : // emerald
                    facility.healthScore >= 40 ? "#F59E0B" : // warning
                    "#EF4444"; // danger
          }

          const marker = new window.google.maps.Marker({
            position: loc,
            map: map,
            title: facility.name || facility.facility_name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 0.9,
              strokeColor: "#FFFFFF",
              strokeWeight: 1.5,
              scale: 9
            }
          });

          marker.addListener("click", () => {
            if (isLiveData) {
              // Show live facility data from National Hospital Directory
              infoWindow.setContent(`
                <div style="color: #0F172A; font-family: system-ui, sans-serif; padding: 6px; min-width: 180px;">
                  <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700;">${facility.name}</h4>
                  <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 600; text-transform: uppercase; color: #64748B;">
                    ${facility.type || 'Health Facility'} · ${facility.block || facility.district || 'Vellore'}
                  </p>
                  <div style="font-size: 11px; line-height: 1.5; color: #334155;">
                    <strong>Total Beds:</strong> ${facility.beds || 'N/A'}<br/>
                    <strong>Status:</strong> <span style="color: ${facility.status === 'operational' ? '#10B981' : '#94A3B8'}; font-weight: 700;">${(facility.status || 'Unknown').toUpperCase()}</span><br/>
                    <strong>State:</strong> ${facility.state || 'Tamil Nadu'}<br/>
                    <div style="margin-top: 4px; padding: 4px; background: #10B981; color: white; border-radius: 4px; text-align: center; font-size: 9px; font-weight: 700;">
                      LIVE DATA - data.gov.in
                    </div>
                  </div>
                </div>
              `);
            } else {
              // Show mock data (fallback)
              const bedPercent = Math.round((facility.bedsOccupied / facility.bedsTotal) * 100);
              infoWindow.setContent(`
                <div style="color: #0F172A; font-family: system-ui, sans-serif; padding: 6px; min-width: 150px;">
                  <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700;">${facility.name}</h4>
                  <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 600; text-transform: uppercase; color: #64748B;">
                    ${facility.type} · ${facility.block}
                  </p>
                  <div style="font-size: 11px; line-height: 1.5; color: #334155;">
                    <strong>${getTranslation('healthScoreLabel', language)}</strong> <span style="color: ${
                      facility.healthScore >= 70 ? '#10B981' : facility.healthScore >= 40 ? '#D97706' : '#EF4444'
                    }; font-weight: 700;">${facility.healthScore}/100</span><br/>
                    <strong>${getTranslation('bedOccupancy', language)}:</strong> ${facility.bedsOccupied}/${facility.bedsTotal} (${bedPercent}%)<br/>
                    <strong>${getTranslation('doctorsLabel', language)}</strong> ${facility.doctorsPresent}/${facility.doctorsOnRoll} ${getTranslation('present', language).toLowerCase()}
                  </div>
                </div>
              `);
            }
            infoWindow.open(map, marker);
            setSelectedCentre(facility);
          });

          activeMarkers.push(marker);
        });

        if (bounds.isEmpty()) {
          // No valid facilities with coordinates, use default center
          map.setCenter({ lat: 12.94, lng: 79.13 });
          map.setZoom(11);
        } else {
          map.fitBounds(bounds);
        }
      } else if (viewMode === 'heatmap') {
        // Plot Heatmap showing critical density zones
        const heatmapData = facilities.map(facility => {
          let loc;
          if (isLiveData) {
            if (!facility.latitude || !facility.longitude) return null;
            loc = { lat: facility.latitude, lng: facility.longitude };
          } else {
            loc = centreLocations[facility.id] || { lat: 12.94, lng: 79.13 };
          }

          bounds.extend(loc);

          // For live data, use fixed weight; for mock data, use health score
          const weight = isLiveData ? 5 : (100 - facility.healthScore) / 10;

          return {
            location: new window.google.maps.LatLng(loc.lat, loc.lng),
            weight: weight
          };
        }).filter(Boolean); // Remove null entries

        activeHeatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map,
          radius: 35
        });

        if (bounds.isEmpty()) {
          map.setCenter({ lat: 12.94, lng: 79.13 });
          map.setZoom(11);
        } else {
          map.fitBounds(bounds);
        }
      }

      setIsMapLoaded(true);
    };

    if (!window.google) {
      const existingScript = document.getElementById(scriptId);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&v=3.64`;
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    } else {
      initMap();
    }

    return () => {
      activeMarkers.forEach(m => m.setMap(null));
      if (activeHeatmap) activeHeatmap.setMap(null);
    };
  }, [viewMode, publicData]);

  return (
    <div className="min-h-screen bg-navy text-text-primary p-6">
      
      {/* Dynamic API Banner */}
      {!hasApiKey && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-center justify-between text-warning">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} />
            <span className="text-xs font-medium">
              Google Maps API key not set in `.env` (`VITE_GOOGLE_MAPS_API_KEY`). Showing map in sandbox developer mode.
            </span>
          </div>
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-xs font-bold underline hover:text-warning-hover">
            Get Key
          </a>
        </div>
      )}

      {/* Community Coverage Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="rounded-xl border border-border-col bg-surface/50 p-4">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Coverage Blocks</span>
          <span className="text-2xl font-bold font-mono text-text-primary">{Object.keys(blockStats).length}</span>
        </div>
        <div className="rounded-xl border border-border-col bg-surface/50 p-4">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Total Villages</span>
          <span className="text-2xl font-bold font-mono text-text-primary">{totalVillages}</span>
        </div>
        <div className="rounded-xl border border-border-col bg-surface/50 p-4">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Households</span>
          <span className="text-2xl font-bold font-mono text-text-primary">{totalHouseholds.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-border-col bg-surface/50 p-4">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">ASHA Visits / Wk</span>
          <span className="text-2xl font-bold font-mono text-text-primary">{totalVisitsThisWeek}</span>
        </div>
        <div className="rounded-xl border border-border-col bg-surface/50 p-4">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Verified Audits</span>
          <span className="text-2xl font-bold font-mono text-emerald">{verifiedVisitsTotal}</span>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Map Box */}
        <div className="lg:col-span-2 flex flex-col h-[550px] rounded-2xl border border-border-col bg-surface overflow-hidden">
          
          {/* Map Header */}
          <div className="border-b border-border-col bg-surface-dark/40 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-text-muted" />
              <span className="text-sm font-semibold">Interactive Health Registry</span>
            </div>
            
            <div className="flex rounded-lg bg-navy/80 p-0.5 border border-border-col">
              <button
                onClick={() => setViewMode('markers')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'markers' ? 'bg-emerald text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Marker View
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'heatmap' ? 'bg-emerald text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Surge Heatmap
              </button>
            </div>
          </div>
          
          {/* Map Canvas */}
          <div className="flex-1 relative bg-navy/40">
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/80">
                <div className="text-center">
                  <div className="h-8 w-8 border-4 border-emerald border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-text-secondary">Loading Google Maps...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Selected Health Facility Details */}
          <div className="rounded-2xl border border-border-col bg-surface p-5 flex-1">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Facility Details</h3>

            {selectedCentre ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-text-primary">{selectedCentre.name}</h4>
                  <span className="inline-flex items-center rounded-md bg-emerald/10 border border-emerald/20 px-2 py-0.5 text-xs font-semibold text-emerald uppercase mt-1">
                    {selectedCentre.type} · {selectedCentre.block || selectedCentre.district || 'Vellore'}
                  </span>

                  {/* Live data indicator */}
                  {publicData?.healthFacilities && publicData.healthFacilities.length > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald/10 border border-emerald/30 px-2.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald uppercase">Live Data - data.gov.in</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  {/* Show different details based on data source */}
                  {publicData?.healthFacilities && publicData.healthFacilities.length > 0 ? (
                    // Live government facility data
                    <>
                      <div className="flex items-center justify-between text-xs pt-2">
                        <span className="text-text-muted flex items-center gap-1">
                          <Activity size={13} />
                          Total Beds
                        </span>
                        <span className="font-bold">{selectedCentre.beds || 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1">
                          <CheckCircle size={13} />
                          Status
                        </span>
                        <span className={`font-bold ${selectedCentre.status === 'operational' ? 'text-emerald' : 'text-text-muted'}`}>
                          {(selectedCentre.status || 'Unknown').toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1">
                          <MapPin size={13} />
                          State
                        </span>
                        <span className="font-bold">{selectedCentre.state || 'Tamil Nadu'}</span>
                      </div>

                      {selectedCentre.latitude && selectedCentre.longitude && (
                        <div className="rounded-lg bg-navy/30 border border-border-col/50 p-2 mt-3">
                          <p className="text-[9px] text-text-muted mb-1">GPS Coordinates</p>
                          <p className="text-[10px] font-mono text-text-primary">
                            {selectedCentre.latitude.toFixed(6)}, {selectedCentre.longitude.toFixed(6)}
                          </p>
                        </div>
                      )}

                      <div className="rounded-lg bg-emerald/5 border border-emerald/20 p-3 mt-3">
                        <p className="text-[9px] font-bold text-emerald mb-1 uppercase">Data Source</p>
                        <p className="text-[10px] text-text-secondary">
                          National Hospital Directory (data.gov.in)
                        </p>
                      </div>
                    </>
                  ) : (
                    // Mock data (fallback)
                    <>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-muted">Health Rating</span>
                          <span className={`font-bold ${
                            selectedCentre.healthScore >= 70 ? 'text-emerald' : selectedCentre.healthScore >= 40 ? 'text-warning' : 'text-danger'
                          }`}>{selectedCentre.healthScore}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-navy rounded overflow-hidden">
                          <div
                            className={`h-full rounded ${
                              selectedCentre.healthScore >= 70 ? 'bg-emerald' : selectedCentre.healthScore >= 40 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${selectedCentre.healthScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-muted">Beds Available</span>
                          <span>{selectedCentre.bedsTotal - selectedCentre.bedsOccupied} / {selectedCentre.bedsTotal} vacant</span>
                        </div>
                        <div className="h-1.5 w-full bg-navy rounded overflow-hidden">
                          <div
                            className="h-full bg-info rounded"
                            style={{ width: `${Math.round(((selectedCentre.bedsTotal - selectedCentre.bedsOccupied) / selectedCentre.bedsTotal) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2">
                        <span className="text-text-muted flex items-center gap-1">
                          <Stethoscope size={13} />
                          Doctors Present
                        </span>
                        <span className="font-bold">{selectedCentre.doctorsPresent} / {selectedCentre.doctorsOnRoll}</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setSelectedCentre(null)}
                  className="w-full mt-4 rounded-lg bg-navy hover:bg-navy-light border border-border-col px-3 py-2 text-xs font-semibold text-text-secondary transition-all"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div>
                  <MapPin size={24} className="text-text-muted mx-auto mb-2" />
                  <p className="text-xs text-text-secondary">Click any pin or marker on the map to inspect {publicData?.healthFacilities && publicData.healthFacilities.length > 0 ? 'live' : ''} facility data.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Block Performance */}
          <div className="rounded-2xl border border-border-col bg-surface p-5">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Block Scoreboard</h3>
            <div className="space-y-3">
              {Object.values(blockStats).map(block => (
                <div key={block.name} className="flex items-center justify-between p-2 rounded bg-navy/40 border border-border-col/50">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">{block.name}</span>
                    <span className="text-[10px] text-text-muted uppercase">{block.centresCount} clinics</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold font-mono ${
                      block.avgScore >= 70 ? 'text-emerald' : block.avgScore >= 40 ? 'text-warning' : 'text-danger'
                    }`}>
                      {block.avgScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Earth Engine Satellite Analysis */}
          <div className="rounded-2xl border border-border-col bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Satellite size={14} className="text-info" />
                Satellite Analysis
              </h3>
              <button
                onClick={handleLoadSatelliteAnalysis}
                disabled={isLoadingSatellite}
                className="rounded-lg bg-info/10 border border-info/30 px-2.5 py-1 text-[10px] font-semibold text-info hover:bg-info/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoadingSatellite ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load Report'
                )}
              </button>
            </div>

            {satelliteReport ? (
              <div className="space-y-3">
                {/* Vector Breeding Risk */}
                <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={12} className="text-info" />
                    <span className="text-[10px] font-bold text-text-primary uppercase">Water Bodies (Dengue Risk)</span>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Detected</span>
                      <span className="text-text-primary font-mono">{satelliteReport.analyses.vectorBreedingRisk.waterBodyCount} sites</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">High Risk</span>
                      <span className="text-warning font-mono">{satelliteReport.analyses.vectorBreedingRisk.changes.stagnantWaterSites} stagnant</span>
                    </div>
                    <div className="mt-2 rounded bg-warning/10 border border-warning/20 px-2 py-1">
                      <span className="text-[9px] text-warning font-semibold">
                        {satelliteReport.analyses.vectorBreedingRisk.vectorBreedingRisk.riskLevel} RISK
                      </span>
                    </div>
                  </div>
                </div>

                {/* Environmental Health */}
                <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout size={12} className="text-emerald" />
                    <span className="text-[10px] font-bold text-text-primary uppercase">Vegetation Index (NDVI)</span>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Env Health Score</span>
                      <span className="text-emerald font-mono">{satelliteReport.analyses.environmentalHealth.environmentalHealthScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Green Space</span>
                      <span className="text-text-primary font-mono">{satelliteReport.analyses.environmentalHealth.insights.greenSpacePerCapita} m²/person</span>
                    </div>
                  </div>
                </div>

                {/* Air Quality */}
                <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind size={12} className="text-warning" />
                    <span className="text-[10px] font-bold text-text-primary uppercase">Satellite Air Quality</span>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">AQI Estimate</span>
                      <span className="text-warning font-mono">{satelliteReport.analyses.airQuality.airQualityEstimate.aqi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Category</span>
                      <span className="text-text-primary">{satelliteReport.analyses.airQuality.airQualityEstimate.category}</span>
                    </div>
                  </div>
                </div>

                {/* Critical Actions */}
                <div className="rounded-lg bg-emerald/5 border border-emerald/20 p-3">
                  <p className="text-[10px] font-bold text-emerald mb-2 uppercase">Critical Actions</p>
                  <ul className="space-y-1">
                    {satelliteReport.integratedInsights.criticalActions.slice(0, 3).map((action, idx) => (
                      <li key={idx} className="text-[9px] text-text-secondary flex items-start gap-1">
                        <span className="text-emerald shrink-0">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[9px] text-text-muted text-center font-mono pt-2">
                  Data: Sentinel-2, Landsat-8, MODIS, Sentinel-5P
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <Satellite size={24} className="mx-auto text-text-muted mb-2" />
                <p className="text-[10px] text-text-muted">Load satellite imagery analysis</p>
                <p className="text-[9px] text-text-secondary mt-1">Earth Engine geospatial health assessment</p>
              </div>
            )}
          </div>

          {/* Section 4: Live Public Data from Government APIs */}
          <div className="rounded-2xl border border-border-col bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Database size={14} className="text-emerald" />
                Live Public Data
              </h3>
              <button
                onClick={() => refetchPublicData(true)}
                disabled={publicDataLoading}
                className="rounded-lg bg-emerald/10 border border-emerald/30 px-2.5 py-1 text-[10px] font-semibold text-emerald hover:bg-emerald/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {publicDataLoading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>

            {publicData ? (
              <div className="space-y-3">
                {/* Weather Data */}
                {publicData.weather && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud size={12} className="text-info" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">Real-Time Weather</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Temperature</span>
                        <span className="text-text-primary font-mono">{publicData.weather.current.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Humidity</span>
                        <span className="text-text-primary font-mono">{publicData.weather.current.humidity}%</span>
                      </div>
                      {publicData.weather.current.precipitation > 0 && (
                        <div className="flex justify-between">
                          <span className="text-text-muted">Precipitation</span>
                          <span className="text-info font-mono">{publicData.weather.current.precipitation}mm</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Air Quality Data */}
                {publicData.airQuality && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind size={12} className="text-warning" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">Air Quality (CPCB)</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">AQI</span>
                        <span className={`font-mono ${
                          publicData.airQuality.aqi <= 100 ? 'text-emerald' :
                          publicData.airQuality.aqi <= 200 ? 'text-warning' : 'text-danger'
                        }`}>{publicData.airQuality.aqi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Category</span>
                        <span className="text-text-primary">{publicData.airQuality.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Station</span>
                        <span className="text-text-secondary text-[9px]">{publicData.airQuality.station}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* NFHS-5 Indicators */}
                {publicData.nfhs && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={12} className="text-emerald" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">NFHS-5 Health Indicators</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Institutional Deliveries</span>
                        <span className="text-emerald font-mono">{publicData.nfhs.indicators.institutional_deliveries}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Full Immunization</span>
                        <span className="text-info font-mono">{publicData.nfhs.indicators.full_immunization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Anemia in Women</span>
                        <span className="text-warning font-mono">{publicData.nfhs.indicators.anemia_women}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Beds Data - PHC/CHC */}
                {publicData.beds && publicData.beds.length > 0 && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={12} className="text-info" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">PHC/CHC Beds (Tamil Nadu)</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      {publicData.beds.slice(0, 3).map((bed, index) => (
                        <div key={index} className="space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-text-muted">{bed.district || 'District'}</span>
                            <span className="text-text-primary font-mono">{bed.total_beds || (bed.phc_beds + bed.chc_beds)} beds</span>
                          </div>
                        </div>
                      ))}
                      {publicData.beds.length > 3 && (
                        <div className="text-[9px] text-text-secondary italic text-center pt-1">
                          +{publicData.beds.length - 3} more districts
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Census Data */}
                {publicData.census && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={12} className="text-info" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">Census 2011</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Total Population</span>
                        <span className="text-text-primary font-mono">{(publicData.census.population / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Literacy Rate</span>
                        <span className="text-emerald font-mono">{publicData.census.literacy_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Rural Population</span>
                        <span className="text-text-primary font-mono">{((publicData.census.rural_population / publicData.census.population) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TN HMIS Report */}
                {publicData.tnHmis && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={12} className="text-emerald" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">TN HMIS Report ({publicData.tnHmis.year})</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Total Records</span>
                        <span className="text-emerald font-mono">{publicData.tnHmis.total}</span>
                      </div>
                      <div className="text-[9px] text-text-secondary mt-2">
                        Item-wise health management data for Tamil Nadu districts
                      </div>
                    </div>
                  </div>
                )}

                {/* TN Health Contacts */}
                {publicData.tnContacts && (
                  <div className="rounded-lg bg-navy/30 border border-border-col/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={12} className="text-emerald" />
                      <span className="text-[10px] font-bold text-text-primary uppercase">TN Health Offices</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Districts Covered</span>
                        <span className="text-emerald font-mono">{publicData.tnContacts.total}</span>
                      </div>
                      <div className="text-[9px] text-text-secondary mt-2">
                        Deputy Director contact numbers for Tamil Nadu health departments
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Sources */}
                <div className="rounded-lg bg-emerald/5 border border-emerald/20 p-3">
                  <p className="text-[9px] font-bold text-emerald mb-2 uppercase">Live Data Sources</p>
                  <ul className="space-y-1">
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>data.gov.in - National Open Data Portal</span>
                    </li>
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>Open-Meteo - Real-time Weather</span>
                    </li>
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>NFHS-5 - Health Indicators Survey</span>
                    </li>
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>National Hospital Directory</span>
                    </li>
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>PHC/CHC Beds Dataset</span>
                    </li>
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>Tamil Nadu HMIS Report 2013-14</span>
                    </li>
                    <li className="text-[9px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald shrink-0">✓</span>
                      <span>TN Deputy Director Contacts</span>
                    </li>
                  </ul>
                </div>

                <p className="text-[9px] text-text-muted text-center font-mono pt-2">
                  Last updated: {new Date(publicData.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ) : publicDataLoading ? (
              <div className="text-center py-6">
                <Loader2 size={24} className="mx-auto text-text-muted mb-2 animate-spin" />
                <p className="text-[10px] text-text-muted">Fetching live data from government APIs...</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <Database size={24} className="mx-auto text-text-muted mb-2" />
                <p className="text-[10px] text-text-muted">Load live public data</p>
                <p className="text-[9px] text-text-secondary mt-1">Real-time data from data.gov.in and other sources</p>
                {publicDataError && (
                  <p className="text-[9px] text-danger mt-2">Error: {publicDataError}</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
