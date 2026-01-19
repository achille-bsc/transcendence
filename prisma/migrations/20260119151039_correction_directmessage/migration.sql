/*
  Warnings:

  - You are about to drop the column `blockedId` on the `DirectMessage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `DirectMessage` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DirectMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DirectMessage" ("id") SELECT "id" FROM "DirectMessage";
DROP TABLE "DirectMessage";
ALTER TABLE "new_DirectMessage" RENAME TO "DirectMessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
