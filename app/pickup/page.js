"use client";

import Pickup from "@/components/Pickup"
import TodaysLesson from "@/components/TodaysLesson"
import NavigationButtons from '@/components/NavigationButtons';

export default function Mukae() {
  return (
    <div>
      <NavigationButtons />
      <h1 className="text-xl font-bold">今日のスケージュール</h1>
      <div className="flex flex-row">
        <div>
          <Pickup />
        </div>
        <div>
          <TodaysLesson />
        </div>
      </div>
      <NavigationButtons />
    </div>
  )
}