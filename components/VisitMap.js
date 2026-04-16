"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leaflet";

/* ----------------------------------
   ICON GENERATOR
---------------------------------- */
const makePickupIcon = (label, students) => {
  const gradientId = `grad-${Math.random().toString(36).substring(2, 9)}`;

  const colors = students.map((s) => s.color);

  const stops = colors
    .map((color, i) => {
      const offset = (i / (colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}" />`;
    })
    .join("");

  return L.divIcon({
    className: "",
    iconSize: [40, 46],
    iconAnchor: [20, 46],
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
              ${stops}
            </linearGradient>
          </defs>

          <path 
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="url(#${gradientId})"
          />
        </svg>

        <div style="
          font-size: 11px;
          margin-top: -4px;
          background: white;
          padding: 2px 6px;
          border-radius: 6px;
          line-height: 1.2;
          text-align: center;
        ">
          ${label}
        </div>
      </div>
    `,
  });
};

/* ----------------------------------
   CENTER ICON
---------------------------------- */
const staticCenterIcon = L.icon({
  iconUrl: "/icons/logoHead.svg",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

/* ----------------------------------
   AUTO FIT BOUNDS
---------------------------------- */
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
      padding: [40, 40],
      maxZoom: 16,
    });
  }, [locations, map]);

  return null;
}

/* ----------------------------------
   MAIN COMPONENT
---------------------------------- */
export default function VisitMap({ locations }) {
  return (
    <MapContainer
      center={[43.10160200047244, 141.54766074306605]}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds locations={locations} />

      {/* CENTER MARKER */}
      <Marker
        position={[43.10160200047244, 141.54766074306605]}
        icon={staticCenterIcon}
      />

      {/* GROUPED MARKERS */}
      {locations.map((loc, i) => {
        const count = loc.students.length;

        // const label =
        //   count === 1
        //     ? loc.students[0].lastName
        //     : `${count}人`;

        const label = loc.students
          .map((s) => s.lastName)
          .join("<br>");

        const color =
          count === 1
            ? loc.students[0].color
            : "#333"; // neutral for groups

        return (
          <Marker
            key={i}
            position={[loc.lat, loc.lon]}
            icon={makePickupIcon(label, loc.students)}
          >
            <Popup>
              <div>
                <strong>
                  {loc.pickUpLoc === "SCHOOL"
                    ? loc.students[0].schoolName
                    : loc.pickUpLoc === "HOME"
                    ? "家庭"
                    : ""}
                </strong>

                <ul style={{ marginTop: "5px", paddingLeft: "16px" }}>
                  {loc.students.map((s) => (
                    <li key={s.id}>
                      {s.lastName} {s.firstName}
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}