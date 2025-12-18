"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

import dynamic from "next/dynamic";

const VisitMap = dynamic(() => import("@/components/VisitMap"), {
  ssr: false,
});

export default function Today() {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [mapData, setMapData] = useState([]);

  /* ----------------------------------
     ISO → "HH:mm" (LOCAL TIME)
  ---------------------------------- */
  const isoToTime = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  /* ----------------------------------
     FETCH TODAY DATA (SOURCE OF TRUTH)
  ---------------------------------- */
  const fetchTodayData = async () => {
    const todaysDate = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(`/api/allVisits/byDay/${todaysDate}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      const normalized = data.map((visit) => ({
        ...visit,
        pickUpTime: isoToTime(visit.pickUpTime),
      }));

      setDayData(normalized);
    } catch (error) {
      console.error("Error fetching today's data:", error);
    }
  };

  /* ----------------------------------
     INITIAL LOAD
  ---------------------------------- */
  useEffect(() => {
    fetchTodayData().finally(() => setLoading(false));
  }, []);

  /* ----------------------------------
     DERIVE MAP DATA FROM dayData
  ---------------------------------- */
  useEffect(() => {
    const mapped = dayData
      .filter(
        (visit) =>
          visit.pickupCoords?.lat &&
          visit.pickupCoords?.lon
      )
      .map((visit) => ({
        name: visit.student.lastName,
        lat: visit.pickupCoords.lat,
        lon: visit.pickupCoords.lon,
      }));

    setMapData(mapped);
  }, [dayData]);

  /* ----------------------------------
     UPDATE LOCATION (REFETCH REQUIRED)
  ---------------------------------- */
  const updateLocation = async (visitId, pickUpLoc) => {
    try {
      await fetch(`/api/quickVisitSave/location/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickUpLoc }),
      });

      // 🔁 refresh source of truth
      await fetchTodayData();
    } catch (err) {
      console.error("Failed to update location", err);
    }
  };

    const testData = [
    { name: "Sato", lat: 35.6895, lon: 139.6917 },
    { name: "Tanaka", lat: 35.685, lon: 139.70 },
  ];


  /* ----------------------------------
     UPDATE TIME (NO REFETCH NEEDED)
  ---------------------------------- */
  const updateTime = async (visitId, pickUpTime) => {
    // optimistic UI update
    setDayData((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, pickUpTime } : v
      )
    );

    try {
      await fetch(`/api/quickVisitSave/time/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickUpTime }),
      });
    } catch (err) {
      console.error("Failed to update time", err);
    }
  };

  if (loading) return <Loading />;

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Today's Data</h1>

      {/* STUDENT LIST */}
      <div className="space-y-2">
        {dayData.map((visit) => (
          <div
            key={visit.id}
            className="flex items-center gap-4 border p-3 rounded"
          >
            <h2 className="w-40">
              {visit.student.lastName} {visit.student.firstName}
            </h2>

            {visit.lesson?.name && (
              <p className="w-32">{visit.lesson.name}</p>
            )}

            {/* LOCATION */}
            <select
              className="border p-2 rounded"
              value={visit.pickUpLoc ?? "NONE"}
              onChange={(e) =>
                updateLocation(visit.id, e.target.value)
              }
            >
              <option value="NONE">　</option>
              <option value="HOME">家庭</option>
              <option value="SCHOOL">学校</option>
            </select>

            {/* TIME */}
            <input
              type="time"
              className="border p-2 rounded"
              value={visit.pickUpTime ?? ""}
              onChange={(e) =>
                updateTime(
                  visit.id,
                  e.target.value === "" ? null : e.target.value
                )
              }
            />
          </div>
        ))}
      </div>

      {/* MAP DATA (DEBUG VIEW) */}
      <div className="space-y-1 text-sm text-gray-600">
        <h2 className="font-semibold">Map Data</h2>
        {/* {mapData.map((loc, index) => (
          <div key={index}>
            {loc.name}: ({loc.lat}, {loc.lon})
          </div>
        ))} */}
        <VisitMap locations={testData} />
      </div>
    </div>
  );
}
