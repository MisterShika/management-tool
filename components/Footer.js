"use client";

export default function Footer() {
    const today = new Date();

    const formatted = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
    }).format(today);

    return(
        <footer className="py-4 text-center w-full bg-yellow-400 border-t border-yellow-500 mt-6">
            {formatted}
        </footer>
    )
}