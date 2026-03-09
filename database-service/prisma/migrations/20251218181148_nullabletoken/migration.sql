-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT
);
INSERT INTO "new_User" ("email", "id", "pseudo", "token") SELECT "email", "id", "pseudo", "token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_pseudo_key" ON "User"("pseudo");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
