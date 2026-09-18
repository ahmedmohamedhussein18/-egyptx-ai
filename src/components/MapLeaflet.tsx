'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths failing in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Gold Icon matching the EgyptX AI theme (#C9A84C)
const goldIcon = new L.DivIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C9A84C" stroke="#030712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#030712"></circle>
    </svg>
  `,
  className: 'custom-gold-marker bg-transparent',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to handle panning when a destination card is clicked
function MapUpdater({ selectedId, attractions }: { selectedId: string | null, attractions: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const target = attractions.find(a => a.id === selectedId);
      if (target && target.latitude && target.longitude) {
        map.flyTo([target.latitude, target.longitude], 10, {
          duration: 1.5
        });
      }
    }
  }, [selectedId, attractions, map]);

  return null;
}

interface MapLeafletProps {
  attractions: any[];
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export default function MapLeaflet({ attractions, selectedId = null, onMarkerClick }: MapLeafletProps) {
  // Center of Egypt
  const center: [number, number] = [26.8206, 30.8025];

  return (
    <div className="w-full h-[300px] lg:h-[500px] rounded-3xl overflow-hidden border border-[#C9A84C]/20 shadow-lg relative z-0">
      <MapContainer 
        center={center} 
        zoom={6} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="osm-dark-tiles"
        />
        
        <MapUpdater selectedId={selectedId} attractions={attractions} />

        {attractions.map((attr) => {
          if (!attr.latitude || !attr.longitude) return null;
          
          return (
            <Marker 
              key={attr.id} 
              position={[attr.latitude, attr.longitude]} 
              icon={goldIcon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(attr.id),
              }}
            >
              <Popup className="custom-popup">
                <div className="flex flex-col bg-[#0A1628] text-white rounded-lg p-1 min-w-[150px]">
                  <div className="flex flex-col bg-[#0A1628] text-white rounded-lg p-1 min-w-[180px]">
                  <h4 className="font-bold text-sm text-[#C9A84C] mb-1 leading-tight">{attr.name_en}</h4>
                  {attr.name_ar && <span className="text-xs text-gray-300 font-arabic mb-2">{attr.name_ar}</span>}
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] bg-[#1B6B93]/30 text-[#4CC9F0] px-2 py-0.5 rounded capitalize border border-[#1B6B93]/50">
                      {attr.category}
                    </span>
                    <span className="text-xs text-gray-400">{attr.city}</span>
                  </div>

                  {attr.checkins !== undefined && (
                    <div className="pt-2 border-t border-white/10 mt-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Verified Check-ins:</span>
                        <span className="text-xs font-bold text-white">{attr.checkins}</span>
                      </div>
                      
                      {attr.checkins >= 5 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Crowd Level:</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            attr.checkins > 20 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            attr.checkins > 10 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {attr.checkins > 20 ? 'High' : attr.checkins > 10 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-2 text-[9px] text-gray-500 italic text-right">
                        Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Global styles to fix the Leaflet Popup container for our dark theme */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-popup .leaflet-popup-content-wrapper,
        .custom-popup .leaflet-popup-tip {
          background-color: #0A1628;
          border: 1px solid rgba(201,168,76,0.3);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .custom-popup .leaflet-popup-close-button {
          color: #C9A84C !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 10px;
        }
        .osm-dark-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}} />
    </div>
  );
}
