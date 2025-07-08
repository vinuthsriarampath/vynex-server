-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "repo_id" INTEGER NOT NULL,
    "project_name" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "clone_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_repo_id_key" ON "Project"("repo_id");
