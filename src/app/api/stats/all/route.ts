import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request: NextRequest){
    try {
        const projectCount = await prisma.project.count();
        const inProgressProjectsCount = await prisma.project.count({
            where:{
                status: "in-progress"
            }
        });
        const completedProjectsCount = await prisma.project.count({
            where:{
                status: "completed"
            }
        });
        const showcaseProjectsCount = await prisma.project.count({
            where:{
                show_case: true
            }
        });
        return NextResponse.json({
            projectCount,
            inProgressProjectsCount,
            completedProjectsCount,
            showcaseProjectsCount
        });
    }catch (error){
        return NextResponse.json("Internal Server Error", {status: 500})
    }
}