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
        <footer>
            {formatted}
        </footer>
    )
}