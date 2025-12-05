'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from "next/link";

export default function SchoolsPage() {
    const [loading, setLoading] = useState(true);
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        async function fetchSchools() {
            try {
                const res = await fetch("/api/allSchools");
                const data = await res.json();
                setSchools(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchSchools();
    }, []);

    if (loading) {return <Loading />;}

    return (
        <div className="flex flex-col w-full justify-center items-center">
            {/* Title and Button */}
            <div className="w-full max-w-lg flex mb-5 justify-around">
                <h2 className="text-2xl font-semibold">学校一覧</h2>
                <Link
                    href="/schools/addSchool"
                    className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
                >
                学校追加
                </Link>
            </div>
            {/* Main Container */}
            <div className="flex w-full flex-col items-center">
                <div className="w-full max-w-lg border">
                    {schools.length > 0 ? 
                        // Schools are available
                        <div>
                            {schools.map((school) => (
                                <div
                                    key={school.id}
                                    className="flex odd:bg-rose-100 px-1 py-3 border-b border-gray-300 last:border-b-0"
                                >
                                    <div className="flex w-[40%]">
                                        {school.schoolType}
                                    </div>
                                    <div className="flex w-[40%]">
                                        {school.schoolName}
                                    </div>
                                    <div className="flex w-[20%]">
                                        <Link
                                            href={`/school/${school.id}`}
                                            className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
                                        >
                                            詳細
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        // No schools available
                        <div>
                            学校データなし
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}