"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function Today() {
  const [loading, setLoading] = useState(true);
  const [dayData, setDayData] = useState([]);

  useEffect(() => {
    const todaysDate = new Date().toISOString().split("T")[0];

    async function fetchTodayData() {
      try {
        const response = await fetch(`/api/allVisits/byDay/${todaysDate}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setDayData(data);
      } catch (error) {
        console.error("Error fetching today's data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTodayData();
  }, []);

  const updateLocation = async (visitId, pickUpLoc) => {
    // optimistic UI update
    setDayData((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, pickUpLoc } : v
      )
    );

    try {
      await fetch(`/api/quickVisitSave/location/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickUpLoc }),
      });
    } catch (err) {
      console.error("Failed to update location", err);
    }
  };

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

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Today's Data</h1>

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
  );
}
