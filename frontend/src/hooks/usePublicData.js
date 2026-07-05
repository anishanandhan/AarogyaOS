import { useState, useEffect } from 'react';
import { getCachedPublicData } from '../services/publicDataService';

/**
 * React hook to fetch and manage public data from government APIs
 * @param {boolean} autoFetch - Whether to fetch data automatically on mount
 * @returns {Object} - { data, loading, error, refetch }
 */
export function usePublicData(autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const publicData = await getCachedPublicData(forceRefresh);
      setData(publicData);
    } catch (err) {
      console.error('Error fetching public data:', err);
      setError(err.message || 'Failed to fetch public data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook to get weather data specifically
 */
export function useWeatherData() {
  const { data, loading, error, refetch } = usePublicData();

  return {
    weather: data?.weather || null,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get air quality data specifically
 */
export function useAirQuality() {
  const { data, loading, error, refetch } = usePublicData();

  return {
    airQuality: data?.airQuality || null,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get health facilities data
 */
export function useHealthFacilities() {
  const { data, loading, error, refetch } = usePublicData();

  return {
    facilities: data?.healthFacilities || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get NFHS indicators
 */
export function useNFHSData() {
  const { data, loading, error, refetch } = usePublicData();

  return {
    nfhs: data?.nfhs || null,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get beds data
 */
export function useBedsData() {
  const { data, loading, error, refetch } = usePublicData();

  return {
    beds: data?.beds || [],
    loading,
    error,
    refetch,
  };
}

export default usePublicData;
