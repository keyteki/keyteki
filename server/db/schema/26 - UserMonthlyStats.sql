-- Table: public."UserMonthlyStats"

-- DROP TABLE public."UserMonthlyStats";

-- Each user's stats for a calendar month (UTC), cached once the month has ended since they can't change.
-- "Version" is UserStatsService's SummaryVersion; rows from an older version are recomputed on read.
CREATE TABLE public."UserMonthlyStats"
(
    "UserId" integer NOT NULL,
    "Month" date NOT NULL,
    "Version" integer NOT NULL,
    "Data" jsonb NOT NULL,
    "ComputedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_UserMonthlyStats" PRIMARY KEY ("UserId", "Month"),
    CONSTRAINT "FK_UserMonthlyStats_Users_UserId" FOREIGN KEY ("UserId")
        REFERENCES public."Users" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."UserMonthlyStats"
    OWNER to keyteki;
