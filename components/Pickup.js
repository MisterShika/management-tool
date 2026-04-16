"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

import dynamic from "next/dynamic";

const VisitMap = dynamic(
  () => import("@/components/VisitMap"),
  { ssr: false }
);

export default function Pickup() {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [drivers, setDrivers] = useState([]);

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

  /** Fetch Drivers */
  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/allUsers/drivers");
      if (!response.ok) throw new Error("Failed to fetch drivers");

      const drivers = await response.json();
      setDrivers(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  /* ----------------------------------
     INITIAL LOAD
  ---------------------------------- */
  useEffect(() => {
    fetchTodayData().then(() => fetchDrivers()).finally(() => setLoading(false));
  }, []);

  /* ----------------------------------
     DERIVE MAP DATA FROM dayData
  ---------------------------------- */
useEffect(() => {
  const grouped = Object.values(
    dayData.reduce((acc, visit) => {
      const lat = visit.pickupCoords?.lat;
      const lon = visit.pickupCoords?.lon;

      if (lat == null || lon == null) return acc;

      const key = `${lat}-${lon}`;

      if (!acc[key]) {
        acc[key] = {
          lat,
          lon,
          pickUpLoc: visit.pickUpLoc,
          students: [],
        };
      }

      acc[key].students.push({
        id: visit.student.id,
        firstName: visit.student.firstName,
        lastName: visit.student.lastName,
        pickUpLoc: visit.pickUpLoc,
        schoolName: visit.student.school.schoolName,
        color: visit.student.color,
      });

      return acc;
    }, {})
  );

  setMapData(grouped);
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

  const updateDriver = async (visitId, driverId) => {
    // optimistic UI update
    setDayData((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, driverId } : v
      )
    );

    try {
      await fetch(`/api/quickVisitSave/driver/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });
    } catch (err) {
      console.error("Failed to update driver", err);
    }
  };

  if (loading) return <Loading />;

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <div>
      {/* STUDENT LIST */}
      <div>
        {dayData.map((visit) => (
          <div
            key={visit.id}
            className="flex items-center gap-4 border-2 p-3 rounded mb-2 bg-gray-100"
            style={{ borderColor: visit.student.color }}
          >
            <h2 className="w-28">
              {visit.student.lastName} {visit.student.firstName}
            </h2>

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

            {/* Driver */}
            <select className="border p-2 rounded"
              value={visit.driverId ?? "NONE"}
              onChange={(e) =>
                updateDriver(visit.id, e.target.value)
              }
            >
              <option value="NONE">　</option>

              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.lastName}
                </option>
              ))}
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
      <div className="text-sm text-gray-600">
        <VisitMap locations={mapData} />
      </div>
    </div>
  );
}
