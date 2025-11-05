"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function VisitPage() {
  const { id } = useParams();
  const router = useRouter();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchVisit = async () => {
    const res = await fetch(`/api/allVisits/${id}`);
    const data = await res.json();
    setVisit(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchVisit();
  }, [id]);

  const updateVisit = async (updates) => {
    const res = await fetch(`/api/allVisits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setVisit(updated);
  };

  if (loading) return <Loading />;
  if (!visit) return <p>訪問データが見つかりません。</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="mb-4 text-emerald-600 hover:underline">
        ← カレンダーに戻る
      </button>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {visit.student?.lastName} {visit.student?.firstName}
        </h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-3 py-1 bg-emerald-500 text-white rounded"
        >
          {editing ? "保存" : "編集"}
        </button>
      </div>

      <p><strong>追加者:</strong> {visit.addedBy?.name || "不明"}</p>
      <p><strong>作成日時:</strong> {new Date(visit.createdAt).toLocaleString("ja-JP")}</p>

      <div className="mt-4">
        <strong>ステータス:</strong>{" "}
        {editing ? (
          <select
            value={visit.status}
            onChange={(e) => updateVisit({ status: e.target.value })}
            className="ml-2 border p-1 rounded"
          >
            <option value="PLANNED">PLANNED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        ) : (
          <span>{visit.status}</span>
        )}
      </div>

      <div className="mt-4">
        <strong>レッスン:</strong>{" "}
        {visit.lesson ? visit.lesson.name : "なし"}
      </div>

      {visit.completions?.length > 0 && (
        <div className="mt-4">
          <strong>完了したレッスン:</strong>
          <ul className="list-disc ml-5">
            {visit.completions.map((c) => (
              <li key={c.id}>{c.lesson?.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <strong>日報:</strong>
        {visit.dailyReports?.length > 0 ? (
          <ul className="list-disc ml-5 mt-2">
            {visit.dailyReports.map((r) => (
              <li key={r.id}>
                {r.note}（{r.addedBy?.name || "不明"}）{" "}
                <span className="text-gray-500 text-sm">
                  {new Date(r.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">日報はまだありません。</p>
        )}
        <button
          onClick={() => router.push(`/visits/${id}/addReport`)}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          日報を追加
        </button>
      </div>
    </div>
  );
}
