"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentLessonDone({ passedStudentId }) {
    const [studentId, setStudentId] = useState(passedStudentId);
    const [finishedLessons, setFinishedLessons] = useState([]);

    const fetchFinishedLessons = async (id) => {
        try {
            const res = await fetch(`/api/lessonCompletionsByStudent/byId/${id}`); 
            if (!res.ok) throw new Error("Failed to fetch finished lessons");
            const data = await res.json();
            setFinishedLessons(data);
        } catch (err) {
            console.error(err);
            setFinishedLessons([]);
        }
    };

    useEffect(() => {
        if (studentId) {
            fetchFinishedLessons(studentId);
        }
    }, [studentId]);

    return (
        <div>
            <h4 className="text-lg font-semibold my-2">完了レッスン:</h4>
            {finishedLessons.length === 0 ? (
                <div className="text-gray-500">完了レッスンなし</div>
            ) : (
            finishedLessons.map((lesson) => (
                <div
                key={lesson.id}
                className="flex flex-row my-1"
                >
                    <Link
                        href={`/lessons/${lesson.id}`}
                        className="text-blue-600 underline w-1/2"
                    >
                        {lesson.id} : {lesson.name}
                    </Link>
                    <div className="w-1/2">
                        {new Date(lesson.completions[0].completedAt)
                        .toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            ))
            )}
        </div>
    );
}