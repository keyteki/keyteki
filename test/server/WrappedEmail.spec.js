const db = require('../../server/db');
const EmailService = require('../../server/services/EmailService');
const WrappedEmailService = require('../../server/services/WrappedEmailService');
const { WrappedVersion } = require('../../server/services/WrappedService');
const { renderWrappedEmail, unsubscribeToken, isValidUnsubscribeToken } = WrappedEmailService;

const Secret = 'test-secret';

const wrapped = (overrides = {}) => ({
    year: 2026,
    games: 1234,
    wins: 700,
    seconds: 90 * 3600,
    favouriteHouse: { house: 'brobnar', count: 50, source: 'chosen' },
    title: { key: 'brawler', house: 'brobnar', name: 'Brobnar Brawler', count: 300 },
    ...overrides
});

const configService = (values = {}) => ({
    getValueForSection: (section, key) =>
        ({
            appName: 'The Crucible Online',
            publicUrl: 'https://example.test/',
            hmacSecret: Secret,
            ...values
        }[key])
});

describe('Wrapped email', function () {
    describe('unsubscribe tokens', function () {
        it('should accept the token made for the player', function () {
            expect(isValidUnsubscribeToken(Secret, 5, unsubscribeToken(Secret, 5))).toBe(true);
            expect(isValidUnsubscribeToken(Secret, '5', unsubscribeToken(Secret, 5))).toBe(true);
        });

        it("should reject another player's token, a different secret, or anything malformed", function () {
            const token = unsubscribeToken(Secret, 5);

            expect(isValidUnsubscribeToken(Secret, 6, token)).toBe(false);
            expect(isValidUnsubscribeToken('other', 5, token)).toBe(false);
            expect(isValidUnsubscribeToken(Secret, 5, token.slice(1))).toBe(false);
            expect(isValidUnsubscribeToken(Secret, 5, undefined)).toBe(false);
            expect(isValidUnsubscribeToken(Secret, '5 OR 1=1', token)).toBe(false);
            expect(isValidUnsubscribeToken(undefined, 5, token)).toBe(false);
        });
    });

    describe('renderWrappedEmail', function () {
        beforeEach(function () {
            this.render = (overrides = {}) =>
                renderWrappedEmail({
                    appName: 'The Crucible Online',
                    publicUrl: 'https://example.test',
                    user: { id: 5, username: 'player' },
                    wrapped: wrapped(),
                    token: 'abc',
                    ...overrides
                });
        });

        it('should link to the Wrapped page and the unsubscribe page', function () {
            const email = this.render();

            expect(email.subject).toBe("Your 2026 Archon's Chronicle is ready");
            for (const body of [email.text, email.html]) {
                expect(body).toContain('https://example.test/chronicle/2026');
                expect(body).toContain('https://example.test/unsubscribe?id=5');
            }
        });

        it('should show the logo from a fixed address on the site', function () {
            expect(this.render().html).toContain('src="https://example.test/email/tco-logo.png"');
        });

        it('should offer one-click unsubscribe to mail clients', function () {
            expect(this.render().headers).toEqual([
                {
                    Name: 'List-Unsubscribe',
                    Value: '<https://example.test/api/unsubscribe?id=5&token=abc>'
                },
                { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' }
            ]);
        });

        it('should include the headline numbers and house', function () {
            const { text, html } = this.render();

            expect(text).toContain('1234 games, 700 wins and about 90 hours');
            expect(text).toContain('mostly as Brobnar');
            expect(html).toContain('1,234');
            expect(html).toContain('Brobnar');
        });

        it('should leave the house out when there is none', function () {
            const { text, html } = this.render({ wrapped: wrapped({ favouriteHouse: null }) });

            expect(text).not.toContain('mostly as');
            expect(html).not.toContain('Your allegiance');
        });

        it("should include the player's Archon title", function () {
            const { text, html } = this.render();

            expect(text).toContain('The Crucible names you Brobnar Brawler.');
            expect(html).toContain('The Crucible names you');
            expect(html).toContain('Brobnar Brawler');
        });

        it('should escape the username in the HTML', function () {
            const { html } = this.render({ user: { id: 5, username: '<b>x</b>' } });

            expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
            expect(html).not.toContain('<b>x</b>');
        });
    });

    describe('WrappedEmailService', function () {
        beforeEach(function () {
            this.emailService = { sendEmail: vi.fn().mockResolvedValue(true) };
            this.service = new WrappedEmailService(configService(), this.emailService);
            this.query = vi.spyOn(db, 'query').mockResolvedValue([]);
            this.recipients = [
                { UserId: 1, Username: 'alice', Email: 'alice@example.test', Data: wrapped() },
                { UserId: 2, Username: 'bob', Email: 'bob@example.test', Data: wrapped() }
            ];
            vi.spyOn(this.service, 'getRecipients').mockResolvedValue(this.recipients);
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('should not send anything on a dry run', async function () {
            const result = await this.service.send({ year: 2026, dryRun: true });

            expect(result.recipients).toBe(2);
            expect(result.sample.subject).toContain('2026');
            expect(this.emailService.sendEmail).not.toHaveBeenCalled();
            expect(this.query).not.toHaveBeenCalled();
        });

        it('should send each player their email and record it', async function () {
            const result = await this.service.send({ year: 2026, perSecond: 1000 });

            expect(result).toMatchObject({ recipients: 2, sent: 2, failed: 0 });
            const [address, subject, text, options] = this.emailService.sendEmail.mock.calls[0];
            expect(address).toBe('alice@example.test');
            expect(subject).toContain('2026');
            expect(text).toContain('Archon alice');
            expect(options.html).toContain('alice');
            expect(options.headers[0].Value).toContain(`id=1&token=${unsubscribeToken(Secret, 1)}`);
            expect(this.query.mock.calls.map(([, params]) => params)).toEqual([
                [1, 2026],
                [2, 2026]
            ]);
        });

        it('should not record a player as emailed when sending fails, so a re-run retries them', async function () {
            this.emailService.sendEmail.mockResolvedValueOnce(false);

            const result = await this.service.send({ year: 2026, perSecond: 1000 });

            expect(result).toMatchObject({ sent: 1, failed: 1 });
            expect(this.query.mock.calls.map(([, params]) => params)).toEqual([[2, 2026]]);
        });

        it('should carry on and report a player who was sent the email but not recorded as sent', async function () {
            vi.spyOn(this.service, 'markEmailed').mockResolvedValueOnce(false);

            const result = await this.service.send({ year: 2026, perSecond: 1000 });

            expect(result).toMatchObject({ sent: 2, failed: 0, unrecorded: ['alice'] });
            expect(this.emailService.sendEmail).toHaveBeenCalledTimes(2);
        });

        it('should try recording a sent email again before giving up', async function () {
            vi.useFakeTimers();
            this.query
                .mockRejectedValueOnce(new Error('connection lost'))
                .mockResolvedValueOnce([]);

            const recorded = this.service.markEmailed(1, 2026);
            await vi.runAllTimersAsync();

            expect(await recorded).toBe(true);
            expect(this.query).toHaveBeenCalledTimes(2);
            vi.useRealTimers();
        });

        it('should give up recording after a few tries', async function () {
            vi.useFakeTimers();
            this.query.mockRejectedValue(new Error('connection lost'));

            const recorded = this.service.markEmailed(1, 2026);
            await vi.runAllTimersAsync();

            expect(await recorded).toBe(false);
            expect(this.query).toHaveBeenCalledTimes(3);
            vi.useRealTimers();
        });

        it('should refuse to send without the site address or secret', async function () {
            const service = new WrappedEmailService(
                configService({ publicUrl: undefined }),
                this.emailService
            );

            await expect(service.send({ year: 2026 })).rejects.toThrow('lobby.publicUrl');
        });

        it('should only email players who want emails and have an active, verified account', async function () {
            this.service.getRecipients.mockRestore();

            await this.service.getRecipients(2026, 'Alice');

            const [sql, params] = this.query.mock.calls[0];
            for (const condition of [
                '"EmailedAt" IS NULL',
                'NOT u."Disabled"',
                'u."Verified"',
                'u."Settings_EmailUpdates"',
                'w."Version" = $3',
                "interval '2 months'"
            ]) {
                expect(sql).toContain(condition);
            }
            expect(params).toEqual([2026, 'Alice', WrappedVersion]);
        });

        it('should turn off emails for a valid unsubscribe link', async function () {
            expect(await this.service.unsubscribe('7', unsubscribeToken(Secret, 7))).toBe(true);

            const [sql, params] = this.query.mock.calls[0];
            expect(sql).toContain('"Settings_EmailUpdates" = false');
            expect(params).toEqual([7]);
        });

        it('should change nothing for an invalid unsubscribe link', async function () {
            expect(await this.service.unsubscribe('7', unsubscribeToken(Secret, 8))).toBe(false);
            expect(this.query).not.toHaveBeenCalled();
        });
    });

    describe('EmailService', function () {
        beforeEach(function () {
            this.service = new EmailService(configService({ emailFrom: 'noreply@example.test' }));
            this.send = vi.spyOn(this.service.client, 'send').mockResolvedValue({});
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('should send the HTML body and extra headers', async function () {
            const headers = [{ Name: 'List-Unsubscribe', Value: '<https://example.test>' }];

            expect(
                await this.service.sendEmail('a@example.test', 'Subject', 'Text', {
                    html: '<p>Hi</p>',
                    headers
                })
            ).toBe(true);

            const simple = this.send.mock.calls[0][0].input.Content.Simple;
            expect(simple.Body).toEqual({ Text: { Data: 'Text' }, Html: { Data: '<p>Hi</p>' } });
            expect(simple.Headers).toBe(headers);
        });

        it('should still send plain text emails', async function () {
            await this.service.sendEmail('a@example.test', 'Subject', 'Text');

            const simple = this.send.mock.calls[0][0].input.Content.Simple;
            expect(simple.Body.Html).toBeUndefined();
            expect(simple.Headers).toBeUndefined();
        });

        it('should report a failed send', async function () {
            this.send.mockRejectedValue(new Error('throttled'));

            expect(await this.service.sendEmail('a@example.test', 'Subject', 'Text')).toBe(false);
        });

        it('should report nothing sent when email is not configured', async function () {
            const service = new EmailService(configService());

            expect(await service.sendEmail('a@example.test', 'Subject', 'Text')).toBe(false);
        });
    });
});
