'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Using a custom SVG icon for markers
const createIcon = (color: string) => new L.DivIcon({
  html: `
    <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>
  `,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const icons: Record<string, L.DivIcon> = {
  ancient: createIcon('#C8A24A'),
  museum: createIcon('#2684C6'),
  entertainment: createIcon('#9b59b6'),
  hotel: createIcon('#e67e22'),
  restaurant: createIcon('#e74c3c'),
  default: createIcon('#19A974')
};

export default function MapInner({ data, onSelect }: { data: any[], onSelect: (loc: any) => void }) {
  // Center roughly on Cairo
  const center: [number, number] = [30.0444, 31.2357];

  return (
    <MapContainer 
      center={center} 
      zoom={11} 
      style={{ height: '100%', width: '100%', background: '#071827' }}
      zoomControl={false} // Using custom controls
      attributionControl={false}
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {data.map((loc, idx) => {
        if (!loc.latitude || !loc.longitude) return null;
        
        let icon = icons.default;
        if (loc.category?.toLowerCase().includes('ancient')) icon = icons.ancient;
        else if (loc.category?.toLowerCase().includes('museum')) icon = icons.museum;
        
        return (
          <Marker 
            key={idx} 
            position={[loc.latitude, loc.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onSelect(loc)
            }}
          />
        );
      })}
    </MapContainer>
  );
}
