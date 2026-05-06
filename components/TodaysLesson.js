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
                lessonData.length === 0 ? (
                    <p className="text-center text-gray-500 p-4">予定がありません</p>
                ) : (
                    <p className="text-right text-xs px-2 py-1">{lessonData.length}人</p>
                )
            }
            {
                lessonData.map((visit) => (
                    <div key={visit.id}
                        className="flex justify-between items-left xl:items-center p-1 border-gray-200 border-b last:border-b-0 flex-col xl:flex-row" 
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
                                visit.status === "COMPLETED" ? (
                                    visit.completions.length > 0 ? (
                                    <div className="text-sm space-y-1">
                                        {visit.completions.map(c => (
                                        <Link
                                            key={c.id}
                                            href={`/lessons/${c.lesson.id}`}
                                            className="text-green-600 underline block"
                                        >
                                            {c.lesson.id}:{c.lesson.name}
                                        </Link>
                                        ))}
                                    </div>
                                    ) : (
                                    <span className="text-gray-500 text-xs">完了データなし</span>
                                    )
                                ) : visit.status === "CANCELLED" ? (
                                    <span className="text-gray-400 text-xs">キャンセル</span>
                                ) : (
                                    visit.lesson?.id ? (
                                    <Link
                                        href={`/lessons/${visit.lesson.id}`}
                                        className="text-blue-600 underline text-sm"
                                    >
                                        {visit.lesson.id}:{visit.lesson.name}
                                    </Link>
                                    ) : (
                                    <span className="text-gray-500 text-xs">未設定</span>
                                    )
                                )
                                }
                            </span>
                        </div>
                        {/** Right Side */}

                        
                        <div>
                            <Link href={`/visits/${visit.id}`}>
                            <button
                                className={`p-1 py-0 text-white rounded w-[105px] my-1 xl:my-0 xl:ml-1 cursor-pointer ${
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