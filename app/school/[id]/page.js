'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from '@/components/Loading';
import Link from "next/link";

export default function SingleSchoolPage() {
    const { id } = useParams();
    const [schoolData, setSchoolData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [studentList, setStudentList] = useState([]);
    const [studentLoading, setStudentLoading] = useState(true);

    const schoolTypeMap = {
        ELEMENTARY: '小学校',
        MIDDLE: '中学校',
        HIGH: '高校',
        OTHER: '他',
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        async function fetchSchool() {
            try{
                const res = await fetch(`/api/allSchools/byId/${id}`);
                const data = await res.json();
                setSchoolData(data);
                setFormData({
                    schoolName: data.schoolName || '',
                    schoolAddress: data.schoolAddress || '',
                    schoolPhone: data.schoolPhone || '',
                    schoolType: data.schoolType || 'OTHER',
                    schoolLat: data.schoolLat || '',
                    schoolLon: data.schoolLon || '',
                });
            } catch(err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchSchool();
    }, [id]); 
    
    useEffect(() => {
        async function fetchStudents() {
            try{
                const res = await fetch(`/api/studentsBySchools/${id}`);
                const data = await res.json();
                setStudentList(data);
            } catch(err) {
                console.error(err);
            } finally {
                setStudentLoading(false);
            }
        }
        fetchStudents();
    }, [id]); 
    
const handleSave = async () => {
  try {
    const res = await fetch(`/api/allSchools/byId/${schoolData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to update school");
    }

    const updated = await res.json();

    // Update UI
    setSchoolData(updated); 
    setEditing(false);

    console.log("Updated school:", updated);

  } catch (err) {
    console.error("Error saving school:", err);
  }
};

    if (loading) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">学校情報（ID: {schoolData.id}）</h2>
                {!editing && (
                    <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => setEditing(true)}
                    >
                    編集
                    </button>
                )}
            </div>
            <table className="min-w-full border border-gray-300">
            <tbody>
                {[
                { label: '学校', name: 'schoolName' },
                { label: '住所', name: 'schoolAddress' },
                { label: '電話番号', name: 'schoolPhone' },
                { label: 'タイプ', name: 'schoolType', options: schoolTypeMap },
                { label: '緯度', name: 'schoolLat' },
                { label: '経度', name: 'schoolLon' },
                ].map((field) => (
                <tr key={field.name}>
                    <th className="px-4 py-2 border text-left bg-gray-50">{field.label}</th>
                    <td className="px-4 py-2 border">
                    {editing ? (
                        field.options ? (
                        <select
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded"
                        >
                            {Object.entries(field.options).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                            ))}
                        </select>
                        ) : (
                        <input
                            type="text"
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded w-full"
                        />
                        )
                    ) : field.options ? (
                        field.options[schoolData[field.name]] || '未設定'
                    ) : (
                        schoolData[field.name] || ''
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {(!editing && studentList.length > 0) && (
                <div>
                    <h2 className="text-xl font-bold mt-2 mb-1">
                        生徒
                    </h2>
                    <div className="min-w-full border border-slate-400">
                        <div className="flex items-end bg-slate-200 border-b border-slate-400">
                            <div className="w-4/5 px-1">
                                <strong>名前</strong>
                            </div>
                            <div className="w-1/5 border-l border-slate-400 px-1">
                                <strong>学年</strong>
                            </div>
                        </div>
                        {studentList.map((student) => {
                            return(
                                <div key={student.id} className="flex items-center py-2 odd:bg-gray-200">
                                    <Link
                                        href={`/student/${student.id}`}
                                        className="text-blue-600 underline w-4/5 px-1"
                                    >
                                        <span>
                                            <ruby>
                                            {student.lastName}
                                            <rt>{student.lastNameFurigana}</rt>
                                            </ruby>
                                        </span>
                                        <span>
                                            <ruby>
                                            {student.firstName}
                                            <rt>{student.firstNameFurigana}</rt>
                                            </ruby>
                                        </span>
                                    </Link>
                                    <span className="w-1/5 px-1 text-center">
                                        {student.grade}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {editing && (
                <div className="flex gap-2 mt-4">
                    <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleSave}
                    >
                        保存
                    </button>
                    <button
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                    onClick={() => setEditing(false)}
                    >
                        キャンセル
                    </button>
                </div>
            )}
        </div>
    )
}