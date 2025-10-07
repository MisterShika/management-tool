"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import AddVisit from "@/components/AddVisit";

export default function BigCalendarWithModal({ events = [] }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  // Format date to YYYY-MM-DD in local timezone
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleOpenModal = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setIsModalOpen(false);
  };

  const getEventsForDay = (day) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === day.toDateString()
    );
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">Visits Calendar</h2>

      <Calendar
        onChange={setDate}
        value={date}
        tileContent={({ date: tileDate, view }) => {
          if (view !== "month") return null;

          const dayEvents = getEventsForDay(tileDate);

          return (
            <div className="relative w-full h-full flex flex-col items-center">
              {/* Events list */}
              {dayEvents.length > 0 && (
                <ul className="mt-1 w-full">
                  {dayEvents.map((e, i) => (
                    <li
                      key={i}
                      className="text-xs bg-blue-500 text-white rounded px-1 mb-1 truncate text-center"
                    >
                      {e.title}
                    </li>
                  ))}
                </ul>
              )}

              {/* Hover/active Add Event */}
              <span
                onClick={() => handleOpenModal(tileDate)}
                className="add-event-btn absolute bottom-1 px-1 py-0.5 text-xs bg-green-500 text-white rounded cursor-pointer opacity-0 transition-opacity duration-200"
              >
                + Add Event
              </span>
            </div>
          );
        }}
        className="w-full max-w-6xl text-lg border rounded-lg shadow-lg"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              ✖
            </button>

            <AddVisit
              defaultDate={selectedDate ? formatDateLocal(selectedDate) : ""}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* Global CSS */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          font-size: 1.25rem;
        }
        .react-calendar__tile {
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 5px;
          position: relative;
        }
        .react-calendar__tile--now {
          background: #f0f9ff;
        }
        .react-calendar__tile--active {
          background: #3b82f6;
          color: white;
        }
        .react-calendar__tile:hover .add-event-btn,
        .react-calendar__tile--active .add-event-btn {
          opacity: 1;
        }
        .react-calendar__month-view__days__day {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
