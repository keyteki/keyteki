-- Table: public."UserRoles"

-- DROP TABLE public."UserRoles";

CREATE TABLE public."UserRoles"
(
    "UserId" integer NOT NULL,
    "RoleId" integer NOT NULL,
    CONSTRAINT "PK_UserRoles" PRIMARY KEY ("UserId", "RoleId"),
    CONSTRAINT "FK_UserRoles_Roles_RoleId" FOREIGN KEY ("RoleId")
        REFERENCES public."Roles" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_UserRoles_Users_UserId" FOREIGN KEY ("UserId")
        REFERENCES public."Users" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."UserRoles"
    OWNER to keyteki;
-- Index: IX_UserRoles_RoleId

-- DROP INDEX public."IX_UserRoles_RoleId";

CREATE INDEX "IX_UserRoles_RoleId"
    ON public."UserRoles" USING btree
    ("RoleId" ASC NULLS LAST)
    TABLESPACE pg_default;