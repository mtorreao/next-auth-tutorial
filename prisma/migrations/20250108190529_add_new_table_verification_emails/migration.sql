-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('SELF_UNSEND');

-- CreateTable
CREATE TABLE "verification_emails" (
    "id" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL DEFAULT 'SELF_UNSEND',
    "to" TEXT NOT NULL,
    "date_sent" TIMESTAMP(3) NOT NULL,
    "verification_token_identifier" TEXT NOT NULL,
    "verification_token_token" TEXT NOT NULL,

    CONSTRAINT "verification_emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "verification_emails" ADD CONSTRAINT "verification_emails_verification_token_identifier_verifica_fkey" FOREIGN KEY ("verification_token_identifier", "verification_token_token") REFERENCES "verification_tokens"("identifier", "token") ON DELETE RESTRICT ON UPDATE CASCADE;
