"use client";

import React, { useState } from "react";

interface VRLocation {
  id: string;
  title: string;
  location: string;
  videoUrl?: string;
  previewVideo?: string;
  videoSrc?: string;
  matterportUrl?: string;
  embedUrl?: string;
  isMatterport: boolean;
}

const VR_LOCATIONS: VRLocation[] = [
  {
    id: "abu-simbel",
    title: "Abu Simbel Temples",
    location: "ASWAN",
    // رابط Matterport الخاص بمعبد أبو سمبل الذي طلبته
    matterportUrl: "https://my.matterport.com/show/?m=VxYAEMXh6dW",
    isMatterport: true,
  },
  {
    id: "islamic-art-museum",
    title: "Museum of Islamic Art",
    location: "CAIRO",
    videoUrl: "/videos/islamic_art_museum.mp4",
    previewVideo: "/videos/islamic_art_museum.mp4",
    videoSrc: "/videos/islamic_art_museum.mp4",
    matterportUrl: "https://my.matterport.com/show/?m=GLcinPBnEet",
    isMatterport: true,
  },
  {
    id: "coptic-museum",
    title: "The Coptic Museum",
    location: "CAIRO",
    videoUrl: "/videos/coptic_museum.mp4",
    previewVideo: "/videos/coptic_museum.mp4",
    videoSrc: "/videos/coptic_museum.mp4",
    matterportUrl: "https://my.matterport.com/show/?m=yMMHWqMJZbY",
    isMatterport: true,
  },
  {
    id: "gayer-anderson-museum",
    title: "Gayer-Anderson Museum",
    location: "CAIRO",
    videoUrl: "/videos/gayer_anderson.mp4",
    previewVideo: "/videos/gayer_anderson.mp4",
    videoSrc: "/videos/gayer_anderson.mp4",
    matterportUrl: "https://my.matterport.com/show/?m=vrWe4j1FC65",
    isMatterport: true,
  },
  {
    id: "niankhkhnum-tomb",
    title: "Niankhkhnum & Khnumhotep Tomb",
    location: "SAQQARA",
    videoUrl: "/videos/niankhkhnum_tomb.mp4",
    previewVideo: "/videos/niankhkhnum_tomb.mp4",
    videoSrc: "/videos/niankhkhnum_tomb.mp4",
    matterportUrl: "https://my.matterport.com/show/?m=CwRgpfTMpbx",
    isMatterport: true,
  },
  {
    id: "wahty-tomb",
    title: "Wahty Tomb",
    location: "SAQQARA",
    videoUrl: "/videos/wahty_tomb.mp4",
    previewVideo: "/videos/wahty_tomb.mp4",
    videoSrc: "/videos/wahty_tomb.mp4",
    matterportUrl: "https://my.matterport.com/show/?m=BsXpwTSYSyN",
    isMatterport: true,
  },
];

export default function VREgyptSection() {
  const [activeTour, setActiveTour] = useState<typeof VR_LOCATIONS[0] | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-white font-sans" dir="ltr">
      
      {/* رأس القسم */}
      <div className="text-center mb-8">
        <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold px-4 py-1.5 rounded-full">
          VR EGYPT ECOSYSTEM
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-2">
          Immersive 360° & Matterport Tours
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          استكشف عظمة الآثار المصرية بجولات تفاعلية ثلاثية الأبعاد.
        </p>
      </div>

      {/* شبكة المعالم */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {VR_LOCATIONS.map((loc) => (
          <div 
            key={loc.id}
            className="bg-[#111C38] border-2 border-[#D4AF37]/40 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#D4AF37] transition-all"
          >
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md uppercase">
                {loc.location}
              </span>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white mt-2 mb-1 leading-snug line-clamp-2">{loc.title}</h3>
              <p className="text-xs text-gray-400 mt-1">Explore spatial panorama and virtual reality.</p>
            </div>

            {/* أزرار التفاعل (Tour Details و 360) */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setActiveTour(loc)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition-all text-xs cursor-pointer text-center"
              >
                Tour Details ➔
              </button>
              
              {/* زر 360 الخاص بمعبد أبو سمبل يفتح Matterport فوراً */}
              <button
                onClick={() => setActiveTour(loc)}
                className="bg-[#070D1F] border border-[#D4AF37]/60 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] font-bold px-4 py-3 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1"
                title="360° Virtual Tour"
              >
                <span>360°</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة عرض الجولة الافتراضية */}
      {activeTour && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111C38] border-2 border-[#D4AF37] rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* رأس نافذة العرض */}
            <div className="p-4 bg-[#070D1F] border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#D4AF37]">{activeTour.title}</h3>
                <span className="text-[10px] text-gray-400">
                  {activeTour.isMatterport ? "Matterport 3D Spatial Environment" : "Interactive Panorama"}
                </span>
              </div>
              <button
                onClick={() => setActiveTour(null)}
                className="bg-red-500/20 border border-red-500/50 text-red-400 font-bold px-4 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs cursor-pointer"
              >
                ✕ Close VR
              </button>
            </div>

            {/* شاشة العرض (إذا كان أبو سمبل يعرض Matterport، وإذا كان غيره يعرض إطار تفاعلي أو افتراضي) */}
            <div className="flex-1 relative bg-black">
              <iframe
                src={activeTour.isMatterport ? activeTour.matterportUrl : (activeTour.embedUrl || "https://www.google.com/maps/embed?pb=!4v1538055014192!6m8!1m7!1sCdK2TtrqrFuNrPbBhDPIoA!2m2!1d30.04644!2d31.26274!3f180!4f0!5f0.7820865974627469")} 
                title={activeTour.title}
                className="w-full h-full border-0"
                allowFullScreen
                allow="vr; xr; accelerometer; gyroscope; autoplay"
              />
            </div>

            <div className="p-3 bg-[#070D1F] text-center text-xs text-[#D4AF37]">
              {activeTour.isMatterport 
                ? `✨ تم تفعيل جولة Matterport ثلاثية الأبعاد الحصرية لـ (${activeTour.title}) بنجاح!` 
                : "💡 انقر واسحب للاستكشاف الحر."}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
