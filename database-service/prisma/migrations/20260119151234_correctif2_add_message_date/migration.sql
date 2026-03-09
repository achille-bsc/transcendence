/*
  Warnings:

  - Added the required column `message` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DirectMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DirectMessage" ("id", "receiverId", "senderId") SELECT "id", "receiverId", "senderId" FROM "DirectMessage";
DROP TABLE "DirectMessage";
ALTER TABLE "new_DirectMessage" RENAME TO "DirectMessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
