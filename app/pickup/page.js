"use client";

import Pickup from "@/components/Pickup"
import TodaysLesson from "@/components/TodaysLesson"
import NavigationButtons from '@/components/NavigationButtons';

export default function Mukae() {
  return (
    <div>
      <NavigationButtons />
      <h1 className="text-xl font-bold">今日のスケージュール</h1>
      <div>
        <Pickup />
        <TodaysLesson />
      </div>
      <NavigationButtons />
    </div>
  )
}