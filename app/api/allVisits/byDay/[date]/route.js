import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
    const params = await context.params;
    const todaysDate = new Date(params.date);

    try {
        const todaysVisits = await prisma.visit.findMany({
            where: {date: todaysDate},
            include: {
                student: true,
                lesson: true,
            },
            orderBy: {
                pickUpTime: 'asc', 
            },
        });
        return NextResponse.json(todaysVisits);
    } catch (err) {
        console.error("Error fetching visits:", err);
        return NextResponse.json({ error: "Failed to fetch visit" }, { status: 500 });
    }

}