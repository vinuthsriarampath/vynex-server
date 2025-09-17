import {prisma} from "@/lib/prisma";
import {Project} from "@/types/project";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const {newProjects, deletedProjectIds} = await request.json();

    if (!Array.isArray(newProjects) || !Array.isArray(deletedProjectIds)) {
        return NextResponse.json(
            {error: "newProjects and deletedProjectIds are required arrays"},
            {status: 400}
        );
    }

    const newRepos: Project[] = [];
    const actuallyDeletedIds: number[] = [];

    try {
        for (const project of newProjects) {
            if (!project.repo_id || typeof project.repo_id !== "number") {
                continue;
            }

            try {
                const projectRecord = await prisma.project.upsert({
                    where: {repo_id: project.repo_id},
                    update: {
                        repo_name: project.repo_name,
                        html_url: project.html_url,
                        description: project.description,
                        language: project.language,
                        clone_url: project.clone_url,
                        status: project.status,
                        createdAt: project.createdAt,
                        updatedAt: project.updatedAt,
                    },
                    create: {
                        repo_id: project.repo_id,
                        project_name: project.repo_name,
                        repo_name: project.repo_name,
                        html_url: project.html_url,
                        description: project.description || "",
                        language: project.language,
                        clone_url: project.clone_url,
                        status: project.status,
                        createdAt: project.createdAt,
                        updatedAt: project.updatedAt,
                    },
                });

                newRepos.push({
                    ...projectRecord,
                    project_name: projectRecord.project_name || projectRecord.repo_name,
                    language: projectRecord.language || "",
                    description: projectRecord.description || "",
                    status: projectRecord.status as "in-progress" | "completed",
                });
            } catch (error) {
                return NextResponse.json({error: "Unable to create/update project", details: error}, {status: 500});
            }
        }

        if (deletedProjectIds.length > 0) {
            await prisma.project.deleteMany({
                where: {repo_id: {in: deletedProjectIds}},
            });

            actuallyDeletedIds.push(...deletedProjectIds);
        }
        return NextResponse.json({newRepos, deletedProjectIds: actuallyDeletedIds}, {status: 201});
    } catch (error) {
        return NextResponse.json({error: "Something Went Wrong!", details: error}, {status: 500});
    }
}
