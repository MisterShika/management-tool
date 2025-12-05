import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
    const params = await context.params;
    const { id } = params;
    try{
        const school = await prisma.school.findUnique({
            where: { id: Number(id) },
        });

        if (!school) {
            return NextResponse.json({ error: "School not found" }, { status: 404 });
        }

        return NextResponse.json(school);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch school" }, { status: 500 });
    }
}