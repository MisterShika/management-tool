"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddVisit from "@/components/AddVisit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <h2 className="mb-4 text-2xl font-bold">カレンダー</h2>

      <Calendar
        onChange={setDate}
        value={date}
        calendarType="gregory"
        onActiveStartDateChange={({ activeStartDate }) => {
          const y = activeStartDate.getFullYear();
          const m = activeStartDate.getMonth() + 1;
          fetchEvents(y, m); // fetch events whenever month changes
        }}
        tileContent={({ date: tileDate, view }) => {
          if (view !== "month") return null;

          const dayEvents = getEventsForDay(tileDate);

          return (
            <div className="relative w-full h-full flex flex-col items-center flex-end">
              {dayEvents.length > 0 && (
                <ul className="mt-1 w-full flex flex-col items-start px-1 overflow-y-auto max-h-16">
                  {dayEvents.map((e) => (
                    <li
                      key={e.id}
                      className="text-xs rounded px-1 mb-1 bg-white text-black"
                      style={{ border: `2px solid ${e.color}` }}
                    >
                      {e.title}
                    </li>
                  ))}
                </ul>
              )}

              <span onClick={() => handleOpenModal(tileDate)} className="">
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
              </span>
            </div>
          );
        }}
        className="w-full max-w-6xl text-lg border rounded-lg shadow-lg"
      />

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
              onSubmitSuccess={() => {
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                fetchEvents(y, m); // refresh current month after adding
              }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .react-calendar {
          width: 100%;
        }
        .react-calendar__tile {
          height: 150px;
        }
        .react-calendar__tile--now {
        }
        .react-calendar__tile--active {
        }
        .react-calendar__tile:hover .add-event-btn,
        .react-calendar__tile--active .add-event-btn {
        }
        .react-calendar__month-view__days__day {
        }
      `}</style>
    </div>
  );
}
