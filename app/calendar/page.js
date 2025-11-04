"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddVisit from "@/components/AddVisit";
import ViewVisit from "@/components/ViewVisit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [date, setDate] = useState(new Date());

  // Fetch events for a given month
  const fetchEvents = async (year, month) => {
    try {
      const res = await fetch(`/api/allVisits?year=${year}&month=${month}`);
      if (!res.ok) throw new Error("Failed to fetch visits");
      const data = await res.json();
      setEvents(
        data.map((v) => ({
          id: v.id,
          date: v.date,
          title: `${v.student.lastName}`,
          color: v.student.color || "#000000",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    fetchEvents(y, m); // fetch current month on load
  }, []);

  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleOpenAddModal = (day) => {
    setSelectedDate(day);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setSelectedDate(null);
    setIsAddModalOpen(false);
  };

  const handleOpenViewModal = (visitId) => {
    setSelectedVisitId(visitId);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setSelectedVisitId(null);
    setIsViewModalOpen(false);
  };

  const getEventsForDay = (day) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === day.toDateString()
    );
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">カレンダー</h2>

      <Calendar
        onChange={setDate}
        value={date}
        calendarType="gregory"
        onActiveStartDateChange={({ activeStartDate }) => {
          const y = activeStartDate.getFullYear();
          const m = activeStartDate.getMonth() + 1;
          fetchEvents(y, m);
        }}
        tileContent={({ date: tileDate, view }) => {
          if (view !== "month") return null;

          const dayEvents = getEventsForDay(tileDate);

          return (
            <div className="w-full flex flex-col items-center justify-between">
              <div className="flex flex-1 w-full">
                {dayEvents.length > 0 && (
                  <ul className="mt-1 w-full flex flex-col items-start px-1 overflow-y-auto max-h-16">
                    {dayEvents.map((e) => (
                      <li
                        onClick={() => handleOpenViewModal(e.id)}
                        key={e.id}
                        className="text-xs rounded px-1 mb-1 bg-white text-black cursor-pointer"
                        style={{ border: `2px solid ${e.color}` }}
                      >
                        {e.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span className="addEventSpan flex w-full justify-end">
                <span
                  onClick={() => handleOpenAddModal(tileDate)}
                  className="w-4 h-4 bg-emerald-500 flex items-center justify-center rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
                </span>
              </span>
            </div>
          );
        }}
        className="w-full max-w-6xl text-lg border rounded-lg shadow-lg"
      />

      {/* Add Visit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseAddModal}
            >
              ✖
            </button>

            <AddVisit
              defaultDate={selectedDate ? formatDateLocal(selectedDate) : ""}
              onClose={handleCloseAddModal}
              onSubmitSuccess={() => {
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                fetchEvents(y, m);
              }}
            />
          </div>
        </div>
      )}

      {/* View Visit Modal */}
      {isViewModalOpen && selectedVisitId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseViewModal}
            >
              ✖
            </button>
            <ViewVisit visitId={selectedVisitId} />
          </div>
        </div>
      )}

      <style jsx global>{`
        .addEventSpan {
          opacity: 0;
        }
        .react-calendar {
          width: 100%;
        }
        .react-calendar__tile {
          display: flex;
          justify-content: space-between;
          align-content: flex-end;
          box-sizing: border-box;
          height: 150px;
          flex-direction: column;
          border: 1px solid #ddd !important;
        }
        .react-calendar__tile:hover .addEventSpan {
          opacity: 1;
          cursor: pointer;
        }
        .react-calendar__month-view__days__day--weekend {
          background: #f0f8ff;
        }
      `}</style>
    </div>
  );
}
