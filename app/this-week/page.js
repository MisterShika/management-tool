import TodaysLesson from "@/components/TodaysLesson";
import NavigationButtons from "@/components/NavigationButtons";

export default function ThisWeek() {

    const getMonday = () => {
        const today = new Date();
        const day = today.getDay(); // 0 (Sun) → 6 (Sat)

        const diff = day === 0 ? -6 : 1 - day; // adjust when Sunday
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);

        return monday;
    };

    const getWeekdays = () => {
        const monday = getMonday();

        return Array.from({ length: 5 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
        });
    };

    const getJapaneseDay = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("ja-JP", { weekday: "short" });
    };

    const weekdays = getWeekdays();

    return (
        <div>
            <h1 className="text-center text-xl font-bold">今週</h1>
            <NavigationButtons />
            <div
                className="flex flex-wrap"
            >
                {weekdays.map((date) => (
                    <div key={date} className="flex-none w-1/5 p-2">
                        <h2 className="text-center text-sm font-bold">{date} ({getJapaneseDay(date)})</h2>
                        <TodaysLesson date={date} />
                    </div>
                ))}
            </div>
        </div>
    );
}