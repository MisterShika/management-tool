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
        <div 
            className="mt-2 border border-gray-200"
        >
            {
                lessonData.map((visit) => (
                    <div key={visit.id}
                        className="flex justify-between items-center p-1 border-gray-200 border-b last:border-b-0" 
                    >
                        {/** Left Side */}
                        <div>
                            <Link 
                            className="text-blue-600 underline"
                            href={`/student/${visit.student.id}`}>
                                <span>{visit.student.firstName} {visit.student.lastName}</span>
                            </Link>
                            <span
                                className="px-2 "
                            >
                                :
                            </span>
                            <span>
                                {
                                    visit.lesson?.id
                                        ? <Link href={`/lessons/${visit.lesson.id}`} className="text-blue-600 underline">{visit.lesson.name}</Link>
                                        : "レッスン未設定"
                                }
                            </span>
                        </div>
                        {/** Right Side */}
                        <div>
                            <Link href={`/visits/${visit.id}`}>
                                <button className="p-1 py-0 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    訪問を見る
                                </button>
                            </Link>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}