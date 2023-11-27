import React, { useEffect, useState } from 'react';
import styles from './Map.module.css';

import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useCities } from '../context/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useURLPosition } from '../hooks/useURLPosition';

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng, setSearchParams] = useURLPosition();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const convGeoLoactionFormat = [
    geolocationPosition?.lat,
    geolocationPosition?.lng,
  ];

  const positionsEqual = (mapPosition, convGeoLoactionFormat) => {
    return (
      mapPosition.length === convGeoLoactionFormat.length &&
      mapPosition.every((val, index) => val === convGeoLoactionFormat[index])
    );
  };

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  const handleYourLocation = () => {
    getPosition();
    if (geolocationPosition) {
      navigate(
        `form?lat=${convGeoLoactionFormat[0]}&lng=${convGeoLoactionFormat[1]}`
      );
    }
  };
  return (
    <div className={styles.mapContainer}>
      {!positionsEqual(mapPosition, convGeoLoactionFormat) && (
        <Button type='position' onClick={handleYourLocation}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
