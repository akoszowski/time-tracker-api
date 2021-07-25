-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'STOPPED');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timer" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "finishTime" TIMESTAMP(3) NOT NULL,
    "taskId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timer_taskId_unique" ON "Timer"("taskId");

-- AddForeignKey
ALTER TABLE "Timer" ADD FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
