'use client';
import { useEffect, useState } from 'react';
import MenuButton from '@/components/MenuButton';
import Loading from '@/components/Loading';
import Link from "next/link";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [lessonTypes] = useState([
    'ALL',
    'FREE',
    'MINECRAFT',
    'SCRATCH',
    'INDEPENDENT',
    'OTHER',
  ]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch lessons whenever selectedType changes
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url =
          selectedType === 'ALL'
            ? '/api/allLessons'
            : `/api/allLessons/byType/${selectedType}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        setLessons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [selectedType]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col w-full justify-center items-center">
      {/* Title and Button */}
      <div className="w-full max-w-lg flex mb-5 justify-around">
        <h2 className="text-2xl font-semibold">レッスン一覧</h2>
        <Link
        href="/lessons/addLesson"
        className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
        >
          レッスン追加
        </Link>
      </div>

      {/* Dropdown Filter */}
      <div className="mb-4">
        <label htmlFor="lessonType" className="mr-2 font-medium">
          レッスンタイプ:
        </label>
        <select
          id="lessonType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {lessonTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'ALL' ? 'すべて' : type}
            </option>
          ))}
        </select>
      </div>

      {/* Main Container (name, url, id)*/}
      {isLoading ? (
         <Loading />
      ) : lessons.length > 0 ? (
        <div className="w-full max-w-lg border">
          {lessons.map((lesson) => (
            <div key={lesson.id} 
              className="flex odd:bg-red-100 px-3 py-3 border-b border-gray-300 last:border-b-0"
            >
              {/* Title and Link */}
              <div className="flex w-[80%] justify-between">
                <div className="">
                  {lesson.name}
                </div>
                {lesson.url && (
                  <div className="">
                    <Link href={lesson.url}
                      className="text-blue-600 hover:underline"
                    >
                      外部リンク
                    </Link>
                  </div>
                )}
              </div>
              {/* Button Area */}
              <div className="flex w-[20%] justify-end items-center">
                <Link
                href={`/lessons/${lesson.id}`}
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                >
                  詳細
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          該当するレッスンがありません。
        </div>
      )}
    </div>
  );
}
