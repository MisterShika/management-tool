"use client";

import Pickup from "@/components/Pickup"
import TodaysLesson from "@/components/TodaysLesson"

export default function Mukae() {
  return (
    <div>
      <h1 className="text-xl font-bold">今日のスケージュール</h1>
      <div>
        <Pickup />
        <TodaysLesson />
      </div>
    </div>
  )
}