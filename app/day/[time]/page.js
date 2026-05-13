'use client';

import { useParams } from 'next/navigation';
import TodaysLesson from '@/components/TodaysLesson';
import NavigationButtons from "@/components/NavigationButtons";

export default function SingleDayPage() {
    const { time } = useParams();

    return (
        <div>
            <h1 className="text-center text-xl font-bold">Day: {time}</h1>
            <NavigationButtons />
            <TodaysLesson date={time} />
        </div>
    );
}