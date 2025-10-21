'use client';
import { useEffect, useState } from 'react';
import MenuButton from '@/components/MenuButton';
import Loading from '@/components/Loading';

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
            : `/api/allLessons/${selectedType}`;

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">レッスン一覧</h1>
        <MenuButton link="/lessons/addLesson" buttonTitle="レッスン追加" />
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border-b">レッスン名</th>
              <th className="py-2 px-4 border-b">タイプ</th>
              <th className="py-2 px-4 border-b">説明</th>
              <th className="py-2 px-4 border-b">プロジェクトリンク</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  <Loading />
                </td>
              </tr>
            ) : lessons.length > 0 ? (
              lessons.map((lesson) => (
                <tr key={lesson.id || lesson.name} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">{lesson.name}</td>
                  <td className="py-2 px-4 border-b">{lesson.type}</td>
                  <td className="py-2 px-4 border-b">
                    {lesson.description || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {lesson.url ? (
                      <a
                        href={lesson.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        プロジェクトを見る
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4 border-b">
                  該当するレッスンがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
