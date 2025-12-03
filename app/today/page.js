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
                console.log(data.message);
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
            <pre>{JSON.stringify(dayData, null, 2)}</pre>
        </div>
    )
}