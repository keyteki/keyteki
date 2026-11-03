const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const logger = require('../log.js');

class EmailService {
    constructor(configService) {
        this.fromAddress = configService.getValueForSection('lobby', 'emailFrom');
        this.replyToAddress = configService.getValueForSection('lobby', 'emailReplyTo');
        const awsAccessKeyId = configService.getValueForSection('lobby', 'awsAccessKeyId');
        const awsSecretAccessKey = configService.getValueForSection('lobby', 'awsSecretAccessKey');

        this.client = new SESv2Client({
            region: configService.getValueForSection('lobby', 'awsSesRegion'),
            credentials:
                awsAccessKeyId && awsSecretAccessKey
                    ? { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey }
                    : undefined
        });
    }

    /**
     * @param {string} address
     * @param {string} subject
     * @param {string} text
     * @param {object} [options]
     * @param {string} [options.html] An HTML version of the body, shown by clients that support it
     * @param {{Name: string, Value: string}[]} [options.headers] Extra headers, e.g. List-Unsubscribe
     * @returns {Promise<boolean>} Whether the email was sent
     */
    async sendEmail(address, subject, text, { html, headers } = {}) {
        if (!this.fromAddress) {
            logger.info(`Trying to send email to ${address}, but email not configured.`);
            return false;
        }

        try {
            await this.client.send(
                new SendEmailCommand({
                    FromEmailAddress: this.fromAddress,
                    Destination: { ToAddresses: [address] },
                    ReplyToAddresses: this.replyToAddress ? [this.replyToAddress] : undefined,
                    Content: {
                        Simple: {
                            Subject: { Data: subject },
                            Body: {
                                Text: { Data: text },
                                Html: html ? { Data: html } : undefined
                            },
                            Headers: headers
                        }
                    }
                })
            );
        } catch (err) {
            logger.error('Unable to send email %s', err);
            return false;
        }

        return true;
    }
}

module.exports = EmailService;
