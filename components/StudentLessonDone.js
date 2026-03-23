"use client";

import { useEffect, useState } from "react";

export default function StudentLessonDone({ passedStudentId }) {
    const [studentId, setStudentId] = useState(passedStudentId);

    useEffect(() => {
        
    }, [studentId]);

    return (
        <div>
            
        </div>
    );
}