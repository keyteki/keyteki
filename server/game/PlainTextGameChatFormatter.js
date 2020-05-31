const moment = require('moment');

const HeaderDivider = '='.repeat(20);

class PlainTextGameChatFormatter {
    constructor(gameChat) {
        this.gameChat = gameChat;
    }

    get messages() {
        return this.gameChat.messages;
    }

    format() {
        return this.messages.map((messageProps) => this.formatMessage(messageProps)).join('\n');
    }

    formatMessage(messageProps) {
        return `${moment(messageProps.date).format(
            'YYYY-MM-DD HH:mm:ss'
        )} ${this.formatMessageFragment(messageProps.message)}`;
    }

    formatMessageFragment(messageProps) {
        let result = '';
        for (const [key, fragment] of Object.entries(messageProps)) {
            if (fragment === null || fragment === undefined) {
                continue;
            }

            if (key === 'alert') {
                let message = this.formatMessageFragment(fragment.message);

                switch (fragment.type) {
                    case 'endofround':
                    case 'phasestart':
                    case 'startofround':
                        result += `${HeaderDivider} ${message} ${HeaderDivider}`;
                        break;
                    case 'success':
                    case 'info':
                    case 'danger':
                    case 'warning':
                        result += `${fragment.type.toUpperCase()} ${message}`;
                        break;
                    default:
                        result += message;
                        break;
                }
            } else if (fragment.message) {
                result += this.formatMessageFragment(fragment.message);
            } else if (fragment.argType === 'card') {
                result += fragment.label;
            } else if (fragment.name && fragment.argType === 'player') {
                result += `${fragment.name}:`;
            } else if (fragment.argType === 'nonAvatarPlayer') {
                result += fragment.name;
            } else if (fragment.argType === 'link') {
                result += fragment.link;
            } else {
                result += fragment.toString();
            }
        }

        return result;
    }
}

module.exports = PlainTextGameChatFormatter;
