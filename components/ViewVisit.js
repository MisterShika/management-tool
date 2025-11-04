"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function ViewVisit({ visitId }) {
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await fetch(`/api/allVisits/${visitId}`);
        const data = await res.json();
        setVisit(data);
      } catch (err) {
        console.error("Failed to fetch visit:", err);
      } finally {
        setLoading(false);
      }
    };

    if (visitId) fetchVisit();
  }, [visitId]);

  if (loading) return <Loading />;
  if (!visit) return <p>訪問データが見つかりません。</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">
        {visit.student?.lastName} {visit.student?.firstName}
      </h3>
      <p className="mb-1">
        <strong>日付:</strong>{" "}
        {new Date(visit.date).toLocaleDateString("ja-JP")}
      </p>
      <p className="mb-1">
        <strong>ステータス:</strong> {visit.status}
      </p>
      {visit.lesson && (
        <p className="mb-1">
          <strong>レッスン:</strong> {visit.lesson.name}
        </p>
      )}
      {visit.dailyReports?.length > 0 && (
        <div className="mt-3">
          <strong>日報:</strong>
          <ul className="list-disc ml-5">
            {visit.dailyReports.map((r) => (
              <li key={r.id}>
                {r.note}（{r.addedBy?.name || "不明"}）
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
