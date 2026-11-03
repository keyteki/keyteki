const crypto = require('crypto');

const logger = require('../log');
const db = require('../db');
const EmailService = require('./EmailService');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const capitalise = (value) => (value ? value[0].toUpperCase() + value.slice(1) : value);

/**
 * A token that lets the holder turn off a player's emails without logging in, for unsubscribe links
 * @param {string} secret
 * @param {number|string} userId
 */
function unsubscribeToken(secret, userId) {
    return crypto.createHmac('sha256', secret).update(`UNSUBSCRIBE ${userId}`).digest('hex');
}

/**
 * @param {string} secret
 * @param {number|string} userId
 * @param {string} token
 */
function isValidUnsubscribeToken(secret, userId, token) {
    if (!secret || !/^\d+$/.test(String(userId)) || typeof token !== 'string') {
        return false;
    }

    const expected = Buffer.from(unsubscribeToken(secret, userId));
    const given = Buffer.from(token);

    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

/**
 * The Wrapped email for one player
 * @param {object} options
 * @param {string} options.appName
 * @param {string} options.publicUrl The site's address, without a trailing slash
 * @param {{id: number, username: string}} options.user
 * @param {object} options.wrapped The player's snapshot
 * @param {string} options.token The player's unsubscribe token
 * @returns {{subject: string, text: string, html: string, headers: {Name: string, Value: string}[]}}
 */
function renderWrappedEmail({ appName, publicUrl, user, wrapped, token }) {
    const year = wrapped.year;
    const wrappedUrl = `${publicUrl}/wrapped/${year}`;
    // A fixed path in public/, as built assets have hashed names
    const logoUrl = `${publicUrl}/email/tco-logo.png`;
    const unsubscribeUrl = `${publicUrl}/unsubscribe?id=${user.id}&token=${token}`;
    const oneClickUrl = `${publicUrl}/api/unsubscribe?id=${user.id}&token=${token}`;
    const hours = Math.round(wrapped.seconds / 3600);
    const house = wrapped.favouriteHouse ? capitalise(wrapped.favouriteHouse.house) : null;

    const facts = [
        ['Games', wrapped.games],
        ['Wins', wrapped.wins],
        ['Hours', hours]
    ];

    const subject = `Your ${year} on ${appName} is ready`;

    const text =
        `Hi ${user.username},\n\n` +
        `Your ${year} Wrapped is ready: ${wrapped.games} games, ${wrapped.wins} wins and about ${hours} hours at the table` +
        (house ? `, mostly as ${house}` : '') +
        '.\n\n' +
        `See the rest, and share it: ${wrappedUrl}\n\n` +
        `${appName} team\n\n` +
        `You're getting this because you played on ${appName} this year. To stop these emails: ${unsubscribeUrl}\n`;

    const cell = ([label, value]) =>
        '<td align="center" style="padding:12px 4px;">' +
        `<div style="font-size:32px;line-height:36px;font-weight:700;color:#ffffff;">${escapeHtml(
            value.toLocaleString('en')
        )}</div>` +
        `<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9b98f;">${escapeHtml(
            label
        )}</div></td>`;

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0b0906;font-family:Helvetica,Arial,sans-serif;color:#f5efe0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0906;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#1a140b;border-radius:12px;">
<tr><td align="center" style="padding:36px 28px 8px;">
<a href="${escapeHtml(publicUrl)}" style="text-decoration:none;"><img src="${escapeHtml(
        logoUrl
    )}" width="280" height="27" alt="${escapeHtml(
        appName
    )}" style="display:block;margin:0 auto;width:280px;max-width:100%;height:auto;border:0;color:#c9b98f;font-size:14px;"></a>
<div style="font-size:56px;line-height:60px;font-weight:700;color:#f0c44d;padding-top:20px;">${year}</div>
<div style="font-size:30px;line-height:36px;font-weight:700;color:#ffffff;">Wrapped</div>
<p style="font-size:17px;line-height:25px;margin:20px 0 4px;">Hi ${escapeHtml(
        user.username
    )}, your year at the Crucible is ready.</p>
</td></tr>
<tr><td style="padding:8px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${facts
        .map(cell)
        .join('')}</tr></table>
</td></tr>
${
    house
        ? `<tr><td align="center" style="padding:4px 28px 0;font-size:16px;line-height:24px;">Your house: <strong style="color:#f0c44d;">${escapeHtml(
              house
          )}</strong></td></tr>`
        : ''
}
<tr><td align="center" style="padding:28px 28px 36px;">
<a href="${escapeHtml(
        wrappedUrl
    )}" style="display:inline-block;background:#f0c44d;color:#1a140b;font-size:17px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:999px;">See your ${year} Wrapped</a>
</td></tr>
</table>
<p style="max-width:520px;font-size:12px;line-height:18px;color:#8f866f;margin:20px auto 0;">You're getting this because you played on ${escapeHtml(
        appName
    )} this year. <a href="${escapeHtml(
        unsubscribeUrl
    )}" style="color:#c9b98f;">Stop these emails</a>.</p>
</td></tr>
</table>
</body>
</html>
`;

    return {
        subject,
        text,
        html,
        headers: [
            { Name: 'List-Unsubscribe', Value: `<${oneClickUrl}>` },
            { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' }
        ]
    };
}

class WrappedEmailService {
    /**
     * @param {import('./ConfigService')} configService
     * @param {EmailService} [emailService]
     */
    constructor(configService, emailService = new EmailService(configService)) {
        this.emailService = emailService;
        this.appName = configService.getValueForSection('lobby', 'appName');
        this.publicUrl = (configService.getValueForSection('lobby', 'publicUrl') || '').replace(
            /\/+$/,
            ''
        );
        this.hmacSecret = configService.getValueForSection('lobby', 'hmacSecret');
    }

    /**
     * Players with a snapshot for the year who haven't been emailed it, want emails, and have a verified, active account
     * @param {number} year
     * @param {string} [username] Only this player
     */
    getRecipients(year, username) {
        return db.query(
            'SELECT w."UserId", u."Username", u."Email", w."Data" FROM "UserWrapped" w ' +
                'JOIN "Users" u ON u."Id" = w."UserId" ' +
                'WHERE w."Year" = $1 AND w."EmailedAt" IS NULL AND NOT u."Disabled" AND u."Verified" ' +
                'AND u."Settings_EmailUpdates" AND u."Email" IS NOT NULL ' +
                'AND ($2::text IS NULL OR lower(u."Username") = lower($2)) ' +
                'ORDER BY w."UserId"',
            [year, username || null]
        );
    }

    /**
     * @param {{UserId: number, Username: string, Data: object}} recipient
     */
    render(recipient) {
        return renderWrappedEmail({
            appName: this.appName,
            publicUrl: this.publicUrl,
            user: { id: recipient.UserId, username: recipient.Username },
            wrapped: recipient.Data,
            token: unsubscribeToken(this.hmacSecret, recipient.UserId)
        });
    }

    /**
     * Sends the Wrapped email to everyone who should get it, recording each one sent so a re-run carries on
     * where it stopped
     * @param {object} options
     * @param {number} options.year
     * @param {string} [options.username]
     * @param {boolean} [options.dryRun] Count the recipients but don't send
     * @param {number} [options.perSecond] Stay under the SES sending rate
     * @param {(message: string) => void} [options.progress]
     * @returns {Promise<{recipients: number, sent: number, failed: number, unrecorded: string[], sample?: object}>}
     * unrecorded lists players who were sent the email but couldn't be marked as emailed
     */
    async send({ year, username, dryRun = false, perSecond = 10, progress = () => {} }) {
        if (!this.publicUrl || !this.hmacSecret) {
            throw new Error(
                'lobby.publicUrl and lobby.hmacSecret must be configured to send emails'
            );
        }

        const recipients = await this.getRecipients(year, username);
        const result = { recipients: recipients.length, sent: 0, failed: 0, unrecorded: [] };
        progress(`${recipients.length} players to email`);

        if (recipients.length > 0) {
            result.sample = this.render(recipients[0]);
        }

        if (dryRun) {
            return result;
        }

        for (const recipient of recipients) {
            const started = Date.now();
            const email = this.render(recipient);
            const sent = await this.emailService.sendEmail(
                recipient.Email,
                email.subject,
                email.text,
                { html: email.html, headers: email.headers }
            );

            if (sent) {
                result.sent++;

                if (!(await this.markEmailed(recipient.UserId, year))) {
                    // Sent but not recorded: a re-run would email them again, so carry on and report them
                    result.unrecorded.push(recipient.Username);
                }
            } else {
                result.failed++;
                logger.error(`Failed to send the Wrapped email to ${recipient.Username}`);
            }

            if ((result.sent + result.failed) % 100 === 0) {
                progress(`${result.sent + result.failed} of ${recipients.length}`);
            }

            await sleep(Math.max(0, 1000 / perSecond - (Date.now() - started)));
        }

        return result;
    }

    /**
     * Records that a player has been sent their email, trying a few times as a re-run would otherwise email them again
     * @returns {Promise<boolean>} Whether it was recorded
     */
    async markEmailed(userId, year, attempts = 3) {
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                await db.query(
                    'UPDATE "UserWrapped" SET "EmailedAt" = now() AT TIME ZONE \'UTC\' WHERE "UserId" = $1 AND "Year" = $2',
                    [userId, year]
                );

                return true;
            } catch (err) {
                logger.error(
                    `Failed to record the Wrapped email to user ${userId} as sent (attempt ${attempt})`,
                    err
                );

                if (attempt < attempts) {
                    await sleep(1000 * attempt);
                }
            }
        }

        return false;
    }

    /**
     * Turns off a player's emails, from an unsubscribe link
     * @returns {Promise<boolean>} Whether the token was valid
     */
    async unsubscribe(userId, token) {
        if (!isValidUnsubscribeToken(this.hmacSecret, userId, token)) {
            return false;
        }

        await db.query('UPDATE "Users" SET "Settings_EmailUpdates" = false WHERE "Id" = $1', [
            Number(userId)
        ]);

        return true;
    }
}

module.exports = WrappedEmailService;
module.exports.renderWrappedEmail = renderWrappedEmail;
module.exports.unsubscribeToken = unsubscribeToken;
module.exports.isValidUnsubscribeToken = isValidUnsubscribeToken;
