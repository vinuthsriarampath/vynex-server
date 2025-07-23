import {NextRequest, NextResponse} from "next/server";
import {ProjectValidationSchema} from "@/lib/validations/project";
import {prisma} from "@/lib/prisma";

export async function PATCH(request:NextRequest,{ params }: { params: { projectId: string } }) {
    try {
        const projectId = parseInt(params.projectId);

        const newProjectData = await request.json();

        const validationResult = ProjectValidationSchema.safeParse(newProjectData);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return NextResponse.json({
                error: "Validation failed",
                details: errors
            }, { status: 400 });
        }

        const validatedData = validationResult.data;

        if (isNaN(projectId)) {
            return NextResponse.json({error: "Invalid project ID"}, {status: 400});
        }

        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const updatedProject = await prisma.project.update({
            where: {id: existingProject.id},
            data: {
                project_name:validatedData.project_name,
                repo_id: validatedData.repo_id,
                repo_name:validatedData.repo_name,
                html_url:validatedData.html_url,
                description:validatedData.description,
                language: validatedData.language,
                clone_url:validatedData.clone_url,
                show_case: validatedData.show_case,
                status: validatedData.status,
                createdAt: validatedData.createdAt,
                updatedAt: validatedData.updatedAt,
            },
        });

        return NextResponse.json(updatedProject, {status: 200});
    }catch(error) {
        return NextResponse.json({error: "Something Went Wrong!"}, {status: 500});
    }
}