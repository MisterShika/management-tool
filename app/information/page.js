'use client';
import { useState, useEffect } from "react";

export default function Information() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
            try {
            const res = await fetch("/api/allStudents");
            const data = await res.json();
            setStudents(data.filter((s) => s.isActive));
            } catch (err) {
            console.error(err);
            }
        }
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/studentReport", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            studentId,
            startDate: startDate || null,
            endDate: endDate || null,
            }),
        });

        const data = await res.json();
        setReportData(data);
    };

    return (
        <div>
            <div className="print:hidden max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold">情報</h2>
                <form onSubmit={handleSubmit}>
                    <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="border p-2 w-full"
                    >
                    <option value="">- 学生を選択 -</option>
                    {students.map((s) => (
                        <option key={s.id} value={s.id}>
                        {s.lastName}({s.lastNameFurigana}) {s.firstName}({s.firstNameFurigana})
                        </option>
                    ))}
                    </select>
                    <div>
                        <div className="my-2">
                            <label>
                            <span className="font-bold">開始日:</span><br />
                            <input type="date" id="startDate" onChange={(e) => setStartDate(e.target.value)}></input>
                            </label>
                        </div>
                        <div className="my-2">
                            <label>
                            <span className="font-bold">終了日:</span><br />
                            <input type="date" id="endDate" onChange={(e) => setEndDate(e.target.value)}></input>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        レポート生成
                    </button>
                </form>
            </div>

            {reportData.length > 0 && (
            <div className="mt-6 print:bg-white">
                <h3 className="text-lg font-bold mb-2">レポート</h3>

                {reportData.map((visit) => (
                <div
                    key={visit.id}
                    className="border p-3 print:border-black"
                >
                    <div className="font-semibold">
                    {new Date(visit.date).toLocaleDateString()}
                    </div>

                    <div>ステータス: {visit.status}</div>

                    {visit.lesson && (
                    <div>レッスン: {visit.lesson.name}</div>
                    )}

                    {visit.completions.length > 0 && (
                    <div>
                        完了:
                        <ul className="list-disc ml-5">
                        {visit.completions.map((c) => (
                            <li key={c.id}>{c.lesson.name}</li>
                        ))}
                        </ul>
                    </div>
                    )}

                    {visit.dailyReports.length > 0 && (
                    <div>
                        メモ:
                        <ul className="ml-3">
                        {visit.dailyReports.map((r) => (
                            console.log(r),
                            <li key={r.id}>・{r.note}</li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
                ))}
            </div>
            )}

        </div>
    );
}