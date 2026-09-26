'use client';

import React, { useEffect, useRef } from 'react';
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

// Category Colors exactly as in the screenshot legend
const categoryColors: Record<string, string> = {
  'معالم أثرية': '#1B6B93', // Blue
  'متاحف': '#9B59B6', // Purple
  'أماكن ترفيهية': '#2ECC71', // Green
  'فنادق': '#C9A84C', // Gold
  'مطاعم': '#E74C3C', // Red
  'default': '#1B6B93',
};

// Colored marker icons for different categories
function createCategoryIcon(color: string) {
  return new L.DivIcon({
    html: `
      <div style="position: relative; width: 28px; height: 38px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5" class="w-7 h-7 drop-shadow-md">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="#fff"></circle>
        </svg>
      </div>
    `,
    className: 'custom-category-marker bg-transparent',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  });
}

function getIconForCategory(category?: string): L.DivIcon {
  const cat = category || 'default';
  const mappedCategory = mapToArabicCategory(cat);
  const color = categoryColors[mappedCategory] || categoryColors['default'];
  return createCategoryIcon(color);
}

function mapToArabicCategory(category: string): string {
  const c = category.toLowerCase();
  if (c.includes('monument') || c.includes('historical') || c.includes('أثرية')) return 'معالم أثرية';
  if (c.includes('museum') || c.includes('متاحف')) return 'متاحف';
  if (c.includes('park') || c.includes('entertainment') || c.includes('ترفيهية')) return 'أماكن ترفيهية';
  if (c.includes('hotel') || c.includes('فنادق')) return 'فنادق';
  if (c.includes('restaurant') || c.includes('مطاعم')) return 'مطاعم';
  return 'معالم أثرية';
}

// Component to handle panning when a destination card is clicked
function MapUpdater({ selectedId, attractions }: { selectedId: string | null, attractions: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const target = attractions.find(a => a.id === selectedId);
      if (target && target.latitude && target.longitude) {
        map.flyTo([target.latitude, target.longitude], 14, {
          duration: 1.5
        });
      }
    }
  }, [selectedId, attractions, map]);

  return null;
}

interface CairoMapProps {
  attractions: any[];
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export default function CairoMap({ attractions, selectedId = null, onMarkerClick }: CairoMapProps) {
  // Center on Cairo specifically
  const cairoCenter: [number, number] = [30.0444, 31.2357];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0 cairo-dark-map">
      
      {/* Absolute Legend Overlays - exactly like screenshot */}
      <div className="absolute top-3 right-3 z-[400] flex gap-2">
        <div className="bg-[#0A1628] text-white border border-[#1e2d45] rounded-lg px-3 py-1 text-[11px] font-bold flex items-center gap-1.5 shadow-md">
          <MapPinIcon className="w-3.5 h-3.5 text-[#4CC9F0]" />
          القاهرة
        </div>
      </div>
      
      <div className="absolute top-14 right-3 z-[400] bg-[#0A1628]/90 backdrop-blur text-white border border-[#1e2d45] rounded-xl p-3 text-[10px] shadow-lg w-32 flex flex-col gap-2">
        {Object.entries(categoryColors).filter(([k]) => k !== 'default').map(([name, color]) => (
          <div key={name} className="flex items-center justify-between">
            <span>{name}</span>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
          </div>
        ))}
      </div>

      <MapContainer 
        center={cairoCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false} // We will use custom or position it later if needed, but screenshot has +/- on right
      >
        {/* Dark Theme TileLayer matching screenshot (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater selectedId={selectedId} attractions={attractions} />

        {attractions.map((attr) => {
          if (!attr.latitude || !attr.longitude) return null;
          
          const arabicCategory = mapToArabicCategory(attr.category);
          
          return (
            <Marker 
              key={attr.id} 
              position={[attr.latitude, attr.longitude]} 
              icon={getIconForCategory(attr.category)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(attr.id),
              }}
            >
              <Popup className="cairo-popup" closeButton={false}>
                <div className="w-[180px] bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100" dir="rtl">
                  {/* Image header like screenshot */}
                  <div className="h-20 w-full relative">
                    <img src={`/images/destinations/cairo.jpg`} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                       <CloseIcon className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                  <div className="p-2.5 text-center">
                    <h4 className="font-bold text-[#0A1628] text-xs mb-0.5 leading-tight">{attr.name_ar || attr.name || attr.name_en}</h4>
                    <p className="text-[9px] text-gray-500 mb-2">{arabicCategory}</p>
                    
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                       <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckIcon className="w-2.5 h-2.5" /> مفتوح</span>
                    </div>

                    {attr.checkins !== undefined && (
                      <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-lg border border-gray-100 mb-2">
                        <span className="text-[9px] text-gray-500">إشارات تحقق اليوم:</span>
                        <span className="text-[10px] font-bold text-[#0A1628]">{attr.checkins}</span>
                      </div>
                    )}
                    
                    <button 
                      className="w-full text-center text-[10px] bg-gray-50 text-[#1B6B93] border border-gray-200 py-1.5 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                      onClick={() => onMarkerClick && onMarkerClick(attr.id)}
                    >
                      عرض التفاصيل <ArrowLeftIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .cairo-popup .leaflet-popup-content-wrapper {
          background-color: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        .cairo-popup .leaflet-popup-tip-container {
          display: none; /* Hide standard tip as custom design is used */
        }
        .cairo-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
      `}} />
    </div>
  );
}

// Simple icons
const MapPinIcon = (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloseIcon = (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckIcon = (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const ArrowLeftIcon = (props:any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
