"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Link from 'next/link';

export default function TodaysLesson () {
    const [loading, setLoading] = useState(true);
    const [lessonData, setLessonData] = useState([]);

    useEffect(() => {
        const fetchTodayData = async () => {
            const todaysDate = new Date().toISOString().split("T")[0];

            try {
                const response = await fetch(`/api/allVisits/byDay/${todaysDate}`);
                if (!response.ok) throw new Error("Failed to fetch data");

                const data = await response.json();

                setLessonData(data);
            } catch (error) {
                console.error("Error fetching today's data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodayData();
    }, []);

    if (loading) return <Loading />;

    return (
        <div>
            {
                lessonData.map((visit) => (
                    <div key={visit.id}>
                        <Link href={`/visits/${visit.id}`}>
                            <span>{visit.student.firstName} {visit.student.lastName} - </span>
                            <span>
                                {
                                    visit.lesson?.id
                                        ? visit.lesson.name
                                        : "レッスン未設定"
                                }
                            </span>
                        </Link>
                    </div>
                ))
            }
        </div>
    );
}