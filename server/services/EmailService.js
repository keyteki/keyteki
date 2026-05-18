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

    async sendEmail(address, subject, text) {
        if (!this.fromAddress) {
            logger.info(`Trying to send email to ${address}, but email not configured.`);
            return;
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
                            Body: { Text: { Data: text } }
                        }
                    }
                })
            );
        } catch (err) {
            logger.error('Unable to send email %s', err);
        }
    }
}

module.exports = EmailService;
