"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CompletedLessonStudentList({ passedLessonId }) {
    const [lessonId, setLessonId] = useState(passedLessonId);
    const [completions, setCompletions] = useState([]);

    const fetchStudentsWhoCompletedLesson = async (id) => {
        try {
            const res = await fetch(`/api/studentsWhoCompletedLesson/lessonId/${id}`);
            if (!res.ok) throw new Error("Failed to fetch students who completed lesson");
            const data = await res.json();
            setCompletions(data);
        }catch (err) {
            console.error(err);
            setCompletions([]);
        }
    }

    useEffect(() => {
        if (lessonId) {
            fetchStudentsWhoCompletedLesson(lessonId);
        }
    }, [lessonId]);

    return (
        <div>
            <h4 className="text-lg font-semibold my-2">完了レッスン:</h4>
            {completions.length === 0 ? (
                <div className="text-gray-500">完了レッスンなし</div>
            ) : (
            completions.map((completion) => (
                <div
                key={completion.id}
                className="flex flex-row my-1"
                >
                    <Link
                        href={`/student/${completion.student.id}`}
                        className="text-blue-600 underline w-1/2"
                    >
                        {completion.student.id} : {completion.student.lastName} {completion.student.firstName}
                    </Link>
                    <div className="w-1/2">
                        {new Date(completion.completedAt)
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