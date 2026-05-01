"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Link from 'next/link';

export default function TodaysLesson ({ date }) {
    const [loading, setLoading] = useState(true);
    const [lessonData, setLessonData] = useState([]);
    const todaysDate = date ?? new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchTodayData = async () => {

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

    const statusColors = {
    COMPLETED: "bg-green-500 hover:bg-green-600",
    CANCELLED: "bg-red-500 hover:bg-red-600",
    PLANNED: "bg-blue-500 hover:bg-blue-600",
    };

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
                            <span
                            className="w-2 h-2 rounded-full inline-block mr-2"
                            style={{ backgroundColor: visit.student.color }}
                            ></span>
                            <Link 
                            className="text-blue-600 underline text-sm"
                            href={`/student/${visit.student.id}`}>
                                <span>
                                    <ruby>{visit.student.firstName}<rt>{visit.student.firstNameFurigana}</rt></ruby> &nbsp;
                                    <ruby>{visit.student.lastName}<rt>{visit.student.lastNameFurigana}</rt></ruby>
                                </span>
                            </Link>
                            <span
                                className="px-1 "
                            >
                                -
                            </span>
                            <span>
                                {
                                    visit.lesson?.id
                                        ? <Link href={`/lessons/${visit.lesson.id}`} className="text-blue-600 underline text-sm">{visit.lesson.id}:{visit.lesson.name}</Link>
                                        : <span className="text-gray-500 text-xs">未設定</span>
                                }
                            </span>
                        </div>
                        {/** Right Side */}

                        
                        <div>
                            <Link href={`/visits/${visit.id}`}>
                            <button
                                className={`p-1 py-0 text-white rounded w-[105px] ml-1  ${
                                statusColors[visit.status] || "bg-gray-500"
                                }`}
                            >
                                データを見る
                            </button>
                            </Link>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}