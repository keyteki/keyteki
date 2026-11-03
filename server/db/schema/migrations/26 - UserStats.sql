-- User stats: cache each user's stats for months that have ended (see UserStatsService)

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

-- User stats: each player's annual Wrapped snapshot (see WrappedService)

CREATE TABLE public."UserWrapped"
(
    "UserId" integer NOT NULL,
    "Year" integer NOT NULL,
    "Version" integer NOT NULL,
    "Data" jsonb NOT NULL,
    "GeneratedAt" timestamp without time zone NOT NULL,
    "EmailedAt" timestamp without time zone,
    CONSTRAINT "PK_UserWrapped" PRIMARY KEY ("UserId", "Year"),
    CONSTRAINT "FK_UserWrapped_Users_UserId" FOREIGN KEY ("UserId")
        REFERENCES public."Users" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."UserWrapped"
    OWNER to keyteki;

-- User stats: whether the player wants occasional emails such as the yearly Wrapped (unsubscribe sets it to false)

ALTER TABLE public."Users" ADD COLUMN "Settings_EmailUpdates" boolean NOT NULL DEFAULT true;
