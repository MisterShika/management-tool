'use client';
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function Today() {
    const [loading, setLoading] = useState(true);
    const [dayData, setDayData] = useState(null);

    useEffect(() => {
        const todaysDate = new Date().toISOString().split("T")[0];
        async function fetchTodayData() {
            try {
                const response = await fetch(`api/allVisits/byDay/${todaysDate}`);
                const data = await response.json();
                if (!response.ok) throw new Error("Failed to fetch student");
                setDayData(data);
            }
            catch (error) {
                console.error("Error fetching today's data:", error);
            }
            finally {
                setLoading(false);
                
            }
        }
        fetchTodayData();
    }, []);

    if (loading) return <Loading />;

    return(
        <div>
            <h1>Today's Data</h1>
                <input
                type="time"
          
                className="border p-2 rounded"
                />
            {dayData.map((visit) => (
                <div key={visit.id}>
                    <h2>{visit.student.lastName} {visit.student.firstName}</h2>
                    {visit.pickUpTime && <p>Pick Up Time: {visit.pickUpTime}</p>}
                    {visit.lesson?.name && <p>Lesson: {visit.lesson.name}</p>}
                </div>
            ))}
        </div>
    )
}