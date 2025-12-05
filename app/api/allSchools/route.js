import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const schools = await prisma.school.findMany({
            select: {
                id: true,
                schoolName: true,
                schoolType: true,
                schoolAddress: true,
                schoolLat: true,
                schoolLon: true,
            },
        });
        return NextResponse.json(schools);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch schools" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            schoolName,
            schoolAddress,
            schoolLat,
            schoolLon,
            schoolType,
        } = body;

        // basic validation (optional)
        if (!schoolName || !schoolAddress || !schoolType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newSchool = await prisma.school.create({
            data: {
                schoolName,
                schoolAddress,
                schoolLat,
                schoolLon,
                schoolType,
            },
        });

        return NextResponse.json(newSchool, { status: 201 });
    } catch (err) {
        console.error("Failed to create school:", err);
        return NextResponse.json(
            { error: "Failed to create school" },
            { status: 500 }
        );
    }
}