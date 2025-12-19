"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap  } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leaflet";

/**
 * Create a Leaflet icon using INLINE SVG
 * This is where the SVG actually lives
 */
const makePickupIcon = (label, color) =>
  L.divIcon({
    className: "",
    iconSize: [40, 46],        // include label height
    iconAnchor: [20, 46],      // bottom-center of pin
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      ">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="${color}"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>

        <div style="
          font-size: 11px;
          margin-top: -4px;
          background: white;
          padding: 0 4px;
          border-radius: 4px;
          white-space: nowrap;
        ">
          ${label}
        </div>
      </div>
    `,
  });

const staticCenterIcon = L.icon({
  iconUrl: "/icons/logoHead.svg",
  iconSize: [36, 36],     // match your SVG
  iconAnchor: [18, 36],   // bottom-center
});

function FitBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    const centerPin = [43.10160200047244, 141.54766074306605];

    const bounds = [
      centerPin,
      ...locations.map((loc) => [loc.lat, loc.lon]),
    ];
    map.fitBounds(bounds, {
      padding: [40, 40], // space around edges
      maxZoom: 16,       // prevent zooming in too far
    });
  }, [locations, map]);

  return null;
}

export default function VisitMap({ locations }) {
  return (
    <MapContainer
      center={[43.10160200047244, 141.54766074306605]} // ComeCome
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds locations={locations} />

      <Marker
        position={[43.10160200047244, 141.54766074306605]}
        icon={staticCenterIcon}
      />

      {locations.map((loc, i) => (
        <Marker
          key={i}
          position={[loc.lat, loc.lon]}
          icon={makePickupIcon(loc.name, loc.color)}
        />
      ))}
    </MapContainer>
  );
}
