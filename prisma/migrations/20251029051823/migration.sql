/*
  Warnings:

  - You are about to drop the `friendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."friendship" DROP CONSTRAINT "friendship_friendId_fkey";

-- DropForeignKey
ALTER TABLE "public"."friendship" DROP CONSTRAINT "friendship_userId_fkey";

-- DropTable
DROP TABLE "public"."friendship";

-- CreateTable
CREATE TABLE "Teaching" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL,

    CONSTRAINT "Teaching_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teaching_userId_friendId_key" ON "Teaching"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "Teaching" ADD CONSTRAINT "Teaching_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teaching" ADD CONSTRAINT "Teaching_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
