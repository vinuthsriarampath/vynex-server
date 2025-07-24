// app/api/project/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
    // Extract projectId from query parameters
    const projectId = request.nextUrl.searchParams.get("projectId");

    // Validate projectId
    if (!projectId || isNaN(parseInt(projectId))) {
        return NextResponse.json({ error: "Invalid or missing project ID" }, { status: 400 });
    }

    const parsedProjectId = parseInt(projectId);

    try {
        // Check if the project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: parsedProjectId },
        });

        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Delete the project
        await prisma.project.delete({
            where: { id: parsedProjectId },
        });

        // Return 204 No Content response
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
    }
}