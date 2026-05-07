'use client';
import { useState, useEffect } from "react";
import NavigationButtons from "@/components/NavigationButtons";

export default function Information() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportData, setReportData] = useState([]);

    const [reportStartDate, setReportStartDate] = useState("");
    const [reportEndDate, setReportEndDate] = useState("");
    const [reportStudentFirstName, setReportStudentFirstName] = useState("");
    const [reportStudentLastName, setReportStudentLastName] = useState("");
    const [reportStudentFirstNameFurigana, setReportStudentFirstNameFurigana] = useState("");
    const [reportStudentLastNameFurigana, setReportStudentLastNameFurigana] = useState("");

    const visitStatusLabels = {
        PLANNED: "予定",
        COMPLETED: "完了",
        CANCELLED: "キャンセル",
    };

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
        setReportStartDate(startDate);
        setReportEndDate(endDate);
        const selectedStudent = students.find((s) => s.id === parseInt(studentId));
        setReportStudentLastName(selectedStudent.lastName);
        setReportStudentFirstName(selectedStudent.firstName);
        setReportStudentLastNameFurigana(selectedStudent.lastNameFurigana);
        setReportStudentFirstNameFurigana(selectedStudent.firstNameFurigana);
    };

    return (
        <div className="print:width-full">
            <div className="print:hidden max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
                <NavigationButtons />
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
            <div className="mt-6 print:bg-white print:width-full">
                <div className="flex flex-row">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            教育の訪問レポート
                        </h2>
                        {reportStudentLastName && (
                        <h2 className="text-2xl my-1">
                            <ruby>
                            {reportStudentLastName}
                            <rt>{reportStudentLastNameFurigana}</rt>
                            </ruby>{" "}
                            <ruby>
                            {reportStudentFirstName}
                            <rt>{reportStudentFirstNameFurigana}</rt>
                            </ruby>
                        </h2>
                        )}
                        {reportStartDate && (
                        <span className="my-1 inline-block">
                            <span className="text-gray-600">{new Date(reportStartDate).toLocaleDateString()}</span><span className="font-bold mx-2">から</span>
                        </span>
                        )}
                        {reportEndDate && (
                        <span className="my-1 inline-block">
                            <span className="text-gray-600">{new Date(reportEndDate).toLocaleDateString()}</span><span className="font-bold mx-2">まで</span>
                        </span>
                        )}
                    </div>
                    <div>
                        <button
                        onClick={() => window.print()}
                        className="print:hidden ml-10 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                        >
                        印刷
                        </button>
                    </div>
                </div>

                {reportData.map((visit) => (
                <div
                    key={visit.id}
                    className="p-3 border-t border-gray-200"
                >
                    <div className="font-semibold text-xl my-1">
                        {new Date(visit.date).toLocaleDateString()}
                    </div>

                    <div><span className="underline font-bold text-lg">ステータス:</span> <span className="text-gray-600">{visitStatusLabels[visit.status]}</span></div>

                    {visit.lesson && (
                    <div>
                        <div><span className="underline font-bold text-lg">レッスン:</span> <span className="text-gray-600">{visit.lesson.name}</span></div>
                        <div><span className="underline font-bold text-lg">内容:</span> <span className="text-gray-600">{visit.lesson.description}</span></div>
                    </div>
                    )}

                    {visit.completions.length > 0 && (
                    <div>
                        <span className="underline font-bold text-lg">完了:</span>
                        <ul className="ml-5">
                        {visit.completions.map((c) => (
                            <li key={c.id} className="text-gray-600">・{c.lesson.name}</li>
                        ))}
                        </ul>
                    </div>
                    )}

                    {visit.dailyReports?.some(r => r.note) && (
                    <div>
                        <span className="underline font-bold text-lg">メモ:</span>
                        <ul className="ml-3">
                        {visit.dailyReports
                            .filter(r => r.note?.trim())
                            .map((r) => {
                            const name = r.addedBy
                            ? `${r.addedBy.lastName} ${r.addedBy.firstName}`
                            : "不明";

                            return (
                                <li key={r.id}>
                                    ・<strong>{name}:</strong> <span className="text-gray-600">{r.note}</span>
                                </li>
                            );
                        })}
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