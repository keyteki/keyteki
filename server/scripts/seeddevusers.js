/*eslint no-console: 0*/
const ConfigService = require('../services/ConfigService');
const db = require('../db');

// The admin, test0 and test1 accounts for local development, all with the password 'password'
const PasswordHash = '$2b$10$T7eqHoi26C3ADmTDbGOYseTbsrPdCoNFkMKmgh21T4Y6i9NVylgxG';
const Users = [
    { id: 1, username: 'admin', background: 'Brobnar', orderAbilities: false },
    { id: 2, username: 'test0', background: 'none', orderAbilities: true },
    { id: 3, username: 'test1', background: 'Dis', orderAbilities: true }
];
// UserManager, PermissionsManager and Admin
const AdminRoles = [1, 6, 10];

async function seed() {
    if (new ConfigService().isProduction()) {
        throw new Error('Refusing to add development users to a production database');
    }

    const added = await db.transaction(async (client) => {
        const added = [];

        for (const user of Users) {
            // Skipped if the id, username or email is already taken, such as on a second run
            const rows = await db.queryTran(
                client,
                `INSERT INTO "Users" ("Id", "Password", "Registered", "Username", "Email", "Settings_Background",
                    "Settings_CardSize", "Settings_OrderAbilities", "Settings_ConfirmOneClick",
                    "Settings_UseHalfSizedCards", "Verified", "Disabled", "RegisterIp")
                VALUES ($1, $2, NOW(), $3, $4, $5, 'normal', $6, true, false, true, false, '127.0.0.1')
                ON CONFLICT DO NOTHING RETURNING "Id"`,
                [
                    user.id,
                    PasswordHash,
                    user.username,
                    `${user.username}@example.com`,
                    user.background,
                    user.orderAbilities
                ]
            );

            if (rows.length > 0) {
                added.push(user.username);
            }
        }

        // Only to an admin added just now, never to whichever account already has its id
        if (added.includes('admin')) {
            for (const roleId of AdminRoles) {
                await db.queryTran(
                    client,
                    'INSERT INTO "UserRoles" ("UserId", "RoleId") VALUES (1, $1)',
                    [roleId]
                );
            }
        }

        // The users were inserted with their ids, so move the sequence past them
        await db.queryTran(
            client,
            `SELECT setval('"Users_Id_seq"', GREATEST((SELECT max("Id") FROM "Users"), 11))`
        );

        return added;
    });

    console.info(
        added.length > 0
            ? `Added development users (password: password): ${added.join(', ')}`
            : 'No development users added, they already exist or their ids are taken'
    );
}

seed()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => db.shutdown());
