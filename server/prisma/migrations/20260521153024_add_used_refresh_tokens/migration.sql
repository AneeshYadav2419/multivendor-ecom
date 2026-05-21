-- CreateTable
CREATE TABLE "UsedRefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsedRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsedRefreshToken_tokenHash_key" ON "UsedRefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "UsedRefreshToken_tokenHash_idx" ON "UsedRefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "UsedRefreshToken_userId_idx" ON "UsedRefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "UsedRefreshToken" ADD CONSTRAINT "UsedRefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
