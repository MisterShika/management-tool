'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const lessonTypeMap = {
    FREE: 'フリー',
    MINECRAFT: 'マインクラフト',
    SCRATCH: 'スクラッチ',
    INDEPENDENT: '自主学習',
    OTHER: 'その他',
  };

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/allLessons/byId/${id}`);
        if (!res.ok) throw new Error('Failed to fetch lesson');
        const data = await res.json();
        setLesson(data);
        setFormData({
          name: data.name || '',
          focus: data.focus || '',
          description: data.description || '',
          url: data.url || '',
          type: data.type || 'FREE',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [id]);

  if (loading) return <Loading />;
  if (!lesson) return <p>Lesson not found.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/allLessons/byId/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save lesson');
      const updated = await res.json();
      setLesson(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('更新に失敗しました。');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">レッスン情報（ID: {lesson.id}）</h2>
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
            { label: '名前', name: 'name' },
            { label: 'フォーカス', name: 'focus' },
            { label: '説明', name: 'description' },
            { label: 'URL', name: 'url' },
            { label: 'タイプ', name: 'type', options: lessonTypeMap },
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
                  field.options[lesson[field.name]] || '未設定'
                ) : (
                  lesson[field.name] || ''
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
  );
}
