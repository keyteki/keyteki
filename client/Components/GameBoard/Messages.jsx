import React from 'react';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';
import { Constants } from '../../constants';

import './Messages.scss';

const Messages = ({ messages, onCardMouseOver, onCardMouseOut }) => {
    const tokens = {
        amber: { className: 'icon-amber', imageSrc: '/img/amber.png' },
        card: { className: 'icon-card', imageSrc: '/img/idbacks/cardback.jpg' },
        cards: { className: 'icon-card', imageSrc: '/img/idbacks/cardback.jpg' },
        forgedkeyblue: { className: 'icon-forgedKey', imageSrc: '/img/forgedkeyblue.png' },
        forgedkeyyellow: { className: 'icon-forgedKey', imageSrc: '/img/forgedkeyyellow.png' },
        forgedkeyred: { className: 'icon-forgedKey', imageSrc: '/img/forgedkeyred.png' },
        unforgedkeyblue: { className: 'icon-forgedKey', imageSrc: '/img/unforgedkeyblue.png' },
        unforgedkeyyellow: {
            className: 'icon-forgedKey',
            imageSrc: '/img/unforgedkeyyellow.png'
        },
        unforgedkeyred: { className: 'icon-forgedKey', imageSrc: '/img/unforgedkeyred.png' }
    };

    for (let house of Constants.Houses) {
        tokens[house] = {
            className: `chat-house-icon icon-${house}`,
            imageSrc: `/img/house/${house}.png`
        };
    }

    const getMessage = () => {
        return messages.map((message, index) => (
            <div key={index} className='message'>
                {formatMessageText(message.message)}
            </div>
        ));
    };

    const formatMessageText = (message) => {
        let index = 0;
        let messages = [];

        for (const [key, fragment] of Object.entries(message)) {
            if (fragment === null || fragment === undefined) {
                messages.push('');

                continue;
            }

            if (key === 'alert') {
                let message = formatMessageText(fragment.message);

                switch (fragment.type) {
                    case 'endofround':
                    case 'phasestart':
                    case 'startofround':
                        messages.push(
                            <div className={'bold seperator ' + fragment.type} key={index++}>
                                <hr className={fragment.type} />
                                {message}
                                {fragment.type === 'phasestart' && <hr />}
                            </div>
                        );
                        break;
                    case 'success':
                        messages.push(
                            <AlertPanel type='success' key={index++} message={message} />
                        );
                        break;
                    case 'info':
                        messages.push(<AlertPanel type='info' key={index++} message={message} />);
                        break;
                    case 'danger':
                        messages.push(<AlertPanel type='danger' key={index++} message={message} />);
                        break;
                    case 'warning':
                        messages.push(
                            <AlertPanel type='warning' key={index++} message={message} />
                        );
                        break;
                    default:
                        messages.push(message);
                        break;
                }
            } else if (fragment.message) {
                messages.push(formatMessageText(fragment.message));
            } else if (fragment.link && fragment.label) {
                messages.push(
                    <a href={fragment.link} target='_blank' rel='noopener noreferrer'>
                        {fragment.label}
                    </a>
                );
            } else if (fragment.image && fragment.label) {
                messages.push(
                    <span
                        key={index++}
                        className='card-link'
                        onMouseOver={onCardMouseOver.bind(this, fragment)}
                        onMouseOut={onCardMouseOut.bind(this)}
                    >
                        {fragment.label}
                    </span>
                );
            } else if (fragment.name && fragment.argType === 'player') {
                let userClass =
                    'username' + (fragment.role ? ` ${fragment.role.toLowerCase()}-role` : '');

                messages.push(
                    <div key={index++} className='message-chat'>
                        <Avatar username={fragment.name} float />
                        <span key={index++} className={userClass}>
                            {fragment.name}
                        </span>
                    </div>
                );
            } else if (fragment.argType === 'nonAvatarPlayer') {
                let userClass =
                    'username' + (fragment.role ? ` ${fragment.role.toLowerCase()}-role` : '');

                messages.push(
                    <span key={index++} className={userClass}>
                        {fragment.name}
                    </span>
                );
            } else {
                let messageFragment = processKeywords(fragment.toString());
                messages.push(messageFragment);
            }
        }

        return messages;
    };

    const processKeywords = (message) => {
        let messages = [];
        let i = 0;

        for (let token of message.split(' ')) {
            let lowerToken = token.toLowerCase();

            if (tokens[lowerToken]) {
                let tokenEntry = tokens[lowerToken];

                switch (token) {
                    case 'amber':
                        token = 'Æmber';
                        break;
                    case 'amber.':
                        token = 'Æmber.';
                        break;
                    case 'forgedkeyblue':
                        token = 'blue key';
                        break;
                    case 'unforgedkeyblue':
                        token = 'blue key';
                        break;
                    case 'unforgedkeyred':
                        token = 'red key';
                        break;
                    case 'unforgedkeyyellow':
                        token = 'yellow key';
                        break;
                    case 'forgedkeyred':
                        token = 'red key';
                        break;
                    case 'forgedkeyyellow':
                        token = 'yellow key';
                        break;
                    default:
                        break;
                }

                messages.push(` ${token} `);
                messages.push(
                    <img
                        key={`${token}-${i++}`}
                        className={tokenEntry.className}
                        src={tokenEntry.imageSrc}
                    />
                );
                messages.push(' ');
            } else {
                messages.push(token + ' ');
            }
        }

        return messages;
    };

    return <div>{getMessage()}</div>;
};

Messages.displayName = 'Messages';

export default Messages;
