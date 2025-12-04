import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const schools = await prisma.school.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                firstNameFurigana: true,
                lastNameFurigana: true,
                birthday: true,
                address: true,
                school: true,
                grade: true,
                gender: true,
                schoolType: true,
                isActive: true,
                color: true,
            },
            orderBy: {
                lastNameFurigana: "asc",
            },
        });
        return NextResponse.json(students);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch schools" },
            { status: 500 }
        );
    }
}