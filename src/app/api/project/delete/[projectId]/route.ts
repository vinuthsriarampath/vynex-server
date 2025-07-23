import {NextRequest} from "next/server";
import {prisma} from "@/lib/prisma";

export async function DELETE(request:NextRequest,{params}: { params : { projectId: string}}){
    const projectId = parseInt(params.projectId);
    if (isNaN(projectId)) {
        return new Response(JSON.stringify({error: "Invalid project ID"}), {status: 400});
    }
    try {
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return new Response(JSON.stringify({error: "Project not found"}), {status: 404});
        }

        await prisma.project.delete({
            where: { id: existingProject.id },
        });

        return new Response(JSON.stringify({status: 204}));
    } catch (error) {
        return new Response(JSON.stringify({error: "Something went wrong!"}), {status: 500});
    }
}