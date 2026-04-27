// /api/studentReport/route.js
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { studentId, startDate, endDate } = body;

  // Fix potential timezone issues
  const start = startDate ? new Date(startDate + "T00:00:00") : null;
  const end = endDate ? new Date(endDate + "T23:59:59") : null;

  const visits = await prisma.visit.findMany({
    where: {
      studentId: Number(studentId),
      
      ...(start || end
        ? {
            date: {
              ...(start ? { gte: start } : {}),
              ...(end ? { lte: end } : {}),
            },
          }
        : {}),
    },
    include: {
      lesson: true,
      dailyReports: true,
      completions: {
        include: {
          lesson: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return Response.json(visits);
}