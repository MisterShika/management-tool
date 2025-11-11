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

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  const [lessonOptions, setLessonOptions] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Fetch visit data
  useEffect(() => {
    if (!id || typeof window === "undefined") return;

    const fetchVisit = async () => {
      try {
        const res = await fetch(`/api/allVisits/${id}`);
        if (!res.ok) throw new Error("Failed to fetch visit");
        const data = await res.json();
        setVisit(data);
        setSelectedStatus(data.status);
        setSelectedType(data.lesson?.type || "");
        setSelectedLessonId(data.lesson?.id || "");
      } catch (err) {
        console.error("Error fetching visit:", err);
        setVisit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [id]);

  // Fetch lessons by type
  useEffect(() => {
    if (!selectedType) {
      setLessonOptions([]);
      return;
    }

    const fetchLessons = async () => {
      setLessonsLoading(true);
      try {
        const res = await fetch(`/api/allLessons/byType/${selectedType}`);
        if (!res.ok) throw new Error("Failed to fetch lessons");
        const data = await res.json();
        setLessonOptions(data);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setLessonOptions([]);
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [selectedType]);

  // Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/allVisits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          lessonId: selectedLessonId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update visit");

      const updated = await res.json();
      setVisit(updated);
      setEditing(false);
    } catch (err) {
      console.error("Error saving visit:", err);
      alert("保存に失敗しました。");
    }
  };

  // Delete visit
  const handleDelete = async () => {
    if (!confirm("本当にこの訪問を削除しますか？")) return;

    try {
      const res = await fetch(`/api/allVisits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete visit");

      alert("削除が完了しました。");
      router.push("/calendar");
    } catch (err) {
      console.error("Error deleting visit:", err);
      alert("削除に失敗しました。");
    }
  };

  if (loading) return <Loading />;
  if (!visit) return <p>訪問データが見つかりません。</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {new Date(visit.date).toLocaleDateString()}
          </h2>
          <div className="flex items-center">
            <h2 className="text-xl font-bold">
              <ruby>
                {visit.student.lastName}
                <rt>{visit.student.lastNameFurigana}</rt>
              </ruby>
              &emsp;
              <ruby>
                {visit.student.firstName}
                <rt>{visit.student.firstNameFurigana}</rt>
              </ruby>
            </h2>
            &emsp;
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: visit.student.color }}
            />
            &emsp;
          </div>
        </div>

        {!editing ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setEditing(true)}
          >
            編集
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSave}
            >
              保存
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setEditing(false)}
            >
              キャンセル
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded border border-red-700 hover:bg-red-700"
              onClick={handleDelete}
            >
              削除
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        追加者: {visit.addedBy?.lastName} {visit.addedBy?.firstName}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        作成日時 : {new Date(visit.createdAt).toLocaleDateString()}
      </p>

      <table className="min-w-full border border-gray-300">
        <tbody>
          {/* Status */}
          <tr>
            <th className="px-4 py-2 border text-left bg-gray-50" colSpan="2">
              ステータス
            </th>
          </tr>
          <tr>
            <td className="px-4 py-2 border" colSpan="2">
              {editing ? (
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="PLANNED">予定</option>
                  <option value="COMPLETED">完了</option>
                  <option value="CANCELLED">キャンセル</option>
                </select>
              ) : (
                {
                  PLANNED: "予定",
                  COMPLETED: "完了",
                  CANCELLED: "キャンセル",
                }[visit.status] || "不明"
              )}
            </td>
          </tr>

          {/* Lesson / Completed Section */}
          {visit.status === "COMPLETED" ? (
            <>
              <tr>
                <th className="px-4 py-2 border text-left bg-gray-50" colSpan="2">
                  完了した授業
                </th>
              </tr>
              <tr>
                <td className="px-4 py-2 border" colSpan="2">
                  {visit.completions.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {visit.completions.map((completion) => (
                        <li key={completion.id}>{completion.lesson.name}</li>
                      ))}
                    </ul>
                  ) : (
                    "データなし"
                  )}
                    <div
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    >
                      授業を追加
                    </div>
                </td>
              </tr>

              <tr>
                <th className="px-4 py-2 border text-left bg-gray-50" colSpan="2">
                  レポート
                </th>
              </tr>
              <tr>
                <td className="px-4 py-2 border" colSpan="2">
                  {visit.dailyReports.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {visit.dailyReports.map((report) => (
                        <li key={report.id}>{report.note}</li>
                      ))}
                    </ul>
                  ) : (
                    "データなし"
                  )}
                    <div
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    >
                      レポートを追加
                    </div>
                </td>
              </tr>
            </>
          ) : (
            // Normal Lesson Section when not completed
            <>
              <tr>
                <th className="px-4 py-2 border text-left bg-gray-50" colSpan="2">
                  授業
                </th>
              </tr>
              <tr>
                {editing ? (
                  <>
                    <td className="px-4 py-2 border">
                      <select
                        className="border px-2 py-1 rounded w-full"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="">種類を選択</option>
                        <option value="FREE">Free</option>
                        <option value="MINECRAFT">Minecraft</option>
                        <option value="SCRATCH">Scratch</option>
                        <option value="INDEPENDENT">Independent</option>
                        <option value="OTHER">その他</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      {lessonsLoading ? (
                        <div className="text-gray-500 text-sm">読み込み中…</div>
                      ) : (
                        <select
                          className="border px-2 py-1 rounded w-full"
                          value={selectedLessonId}
                          onChange={(e) => setSelectedLessonId(e.target.value)}
                          disabled={!selectedType}
                        >
                          <option value="">選択してください</option>
                          {lessonOptions.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                              {lesson.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 border">
                      {visit.lesson ? visit.lesson.type : "データなし"}
                    </td>
                    <td className="px-4 py-2 border">
                      {visit.lesson ? visit.lesson.name : "データなし"}
                    </td>
                  </>
                )}
              </tr>
            </>
          )}


        </tbody>
      </table>
    </div>
  );
}
