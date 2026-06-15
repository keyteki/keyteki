import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import AmberImage from '../../assets/img/amber.png';
import CardBackImage from '../../assets/img/idbacks/cardback.jpg';
import TideImage from '../../assets/img/tide/tide.png';
import { Constants } from '../../constants';
import { getRoleClass } from '../../util';
import AlertPanel from '../Site/AlertPanel';
import Avatar from '../Site/Avatar';
import CardImage from './CardImage';

const keyImages = {};

for (const colour of ['red', 'blue', 'yellow']) {
    keyImages[colour] = {
        forged: new URL(`../../assets/img/forgedkey${colour}.png`, import.meta.url).href,
        unforged: new URL(`../../assets/img/unforgedkey${colour}.png`, import.meta.url).href
    };
}

const Messages = ({ messages, onCardMouseOver, onCardMouseOut }) => {
    const { i18n } = useTranslation();
    const compactChatAlertClass =
        '!mb-1 !rounded-xl !px-3 !py-2 text-sm [&_svg]:text-base [&_[data-slot="alert-content"]]:gap-0.5 [&_[data-slot="alert-description"]]:text-sm';

    const tokens = {
        amber: { className: 'inline-block h-3 w-3 align-text-bottom', imageSrc: AmberImage },
        card: {
            className: 'inline-block h-4 w-3 -mt-1 align-text-bottom',
            imageSrc: CardBackImage
        },
        cards: {
            className: 'inline-block h-4 w-3 -mt-1 align-text-bottom',
            imageSrc: CardBackImage
        },
        forgedkeyblue: {
            className: 'inline-block h-3 w-3 align-middle object-contain',
            imageSrc: keyImages['blue'].forged
        },
        forgedkeyyellow: {
            className: 'inline-block h-3 w-3 align-middle object-contain',
            imageSrc: keyImages['yellow'].forged
        },
        forgedkeyred: {
            className: 'inline-block h-3 w-3 align-middle object-contain',
            imageSrc: keyImages['red'].forged
        },
        tide: { className: 'inline-block h-3 w-3 align-text-bottom', imageSrc: TideImage },
        unforgedkeyblue: {
            className: 'inline-block h-3 w-3 align-middle object-contain',
            imageSrc: keyImages['blue'].unforged
        },
        unforgedkeyyellow: {
            className: 'inline-block h-3 w-3 align-middle object-contain',
            imageSrc: keyImages['yellow'].unforged
        },
        unforgedkeyred: {
            className: 'inline-block h-3 w-3 align-middle object-contain',
            imageSrc: keyImages['red'].unforged
        }
    };

    const owner = useSelector(
        (state) => state.lobby.currentGame.players[state.lobby.currentGame.owner]
    );

    for (const house of Constants.Houses) {
        tokens[house] = {
            className: 'chat-house-icon',
            imageSrc: Constants.HouseIconPaths[house]
        };
    }

    const hasStartOfTurnAlert = (messageObject) =>
        Object.values(messageObject || {}).some((fragment) => fragment?.type === 'startofturn');
    const hasPhaseStartAlert = (messageObject) =>
        Object.values(messageObject || {}).some((fragment) => fragment?.type === 'phasestart');

    const getMessage = () => {
        const latestStartOfTurnIndex = [...messages]
            .map((message, index) => ({
                index,
                isStartOfTurn: hasStartOfTurnAlert(message.message)
            }))
            .filter((entry) => entry.isStartOfTurn)
            .map((entry) => entry.index)
            .pop();

        return messages.map((message, index) => {
            const hasStartOfTurn = hasStartOfTurnAlert(message.message);
            const hasPhaseStart = hasPhaseStartAlert(message.message);
            const className = classNames('message', 'mb-1', {
                'this-player': message.activePlayer && message.activePlayer == owner.name,
                'other-player': message.activePlayer && message.activePlayer !== owner.name,
                'chat-bubble': Object.values(message.message).some(
                    (m) => m.name && m.argType === 'player'
                ),
                'startofturn-row': hasStartOfTurn,
                'phasestart-row': hasPhaseStart
            });

            const isCurrentStartOfTurn =
                latestStartOfTurnIndex !== undefined && index === latestStartOfTurnIndex;
            return (
                <div key={index} className={className}>
                    {formatMessageText(message.message, { isCurrentStartOfTurn })}
                </div>
            );
        });
    };

    const formatMessageText = (message, context = {}) => {
        let index = 0;
        const messages = [];

        for (const [key, fragment] of Object.entries(message)) {
            if (fragment === null || fragment === undefined) {
                messages.push('');

                continue;
            }

            if (key === 'alert') {
                const message = formatMessageText(fragment.message, context);
                switch (fragment.type) {
                    case 'endofturn':
                    case 'phasestart':
                        messages.push(
                            <div
                                className={
                                    'font-semibold text-foreground separator ' + fragment.type
                                }
                                key={index++}
                            >
                                <hr className={'mt-2 mb-2 ' + fragment.type} />
                                {message}
                                {fragment.type === 'phasestart' && <hr />}
                            </div>
                        );
                        break;
                    case 'startofturn':
                        messages.push(
                            <div
                                className={classNames(
                                    'font-semibold text-foreground separator',
                                    fragment.type,
                                    {
                                        'current-turn': context.isCurrentStartOfTurn,
                                        'past-turn': !context.isCurrentStartOfTurn
                                    }
                                )}
                                key={index++}
                            >
                                {message}
                            </div>
                        );
                        break;
                    case 'success':
                        messages.push(
                            <AlertPanel
                                type='success'
                                className={compactChatAlertClass}
                                key={index++}
                            >
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'info':
                        messages.push(
                            <AlertPanel type='info' className={compactChatAlertClass} key={index++}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'danger':
                        messages.push(
                            <AlertPanel
                                type='danger'
                                className={compactChatAlertClass}
                                key={index++}
                            >
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'bell':
                        messages.push(
                            <AlertPanel type='bell' className={compactChatAlertClass} key={index++}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'warning':
                        messages.push(
                            <AlertPanel
                                type='warning'
                                className={compactChatAlertClass}
                                key={index++}
                            >
                                {message}
                            </AlertPanel>
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
                    <a key={index++} href={fragment.link} target='_blank' rel='noopener noreferrer'>
                        {fragment.label}
                    </a>
                );
            } else if (fragment.image && fragment.label) {
                const cardLabel =
                    i18n.language !== 'en' && fragment.locale && fragment.locale[i18n.language]
                        ? fragment.locale[i18n.language].name
                        : fragment.label;
                messages.push(
                    <span
                        key={index++}
                        className='cursor-pointer text-emerald-500 hover:text-cyan-400'
                        onMouseOver={onCardMouseOver.bind(this, {
                            image: <CardImage card={{ ...fragment, location: 'zoom' }} />,
                            size: 'normal'
                        })}
                        onMouseOut={onCardMouseOut.bind(this)}
                    >
                        {cardLabel}
                    </span>
                );
            } else if (fragment.name && fragment.argType === 'player') {
                const userClass = `username ${getRoleClass(fragment.role)}`;

                messages.push(
                    <div key={index++} className='message-chat flex items-center gap-1.5'>
                        <Avatar imgPath={fragment.avatar} />
                        <span key={index++} className={userClass}>
                            {fragment.name}
                        </span>
                    </div>
                );
            } else if (fragment.argType === 'nonAvatarPlayer') {
                const userClass = `username ${getRoleClass(fragment.role)}`;

                messages.push(
                    <span key={index++} className={userClass}>
                        {fragment.name}
                    </span>
                );
            } else {
                const messageFragment = processKeywords(fragment.toString());
                messages.push(
                    <span key={index++} className='message-fragment'>
                        {messageFragment}
                    </span>
                );
            }
        }

        return messages;
    };

    const processKeywords = (message) => {
        const messages = [];
        let i = 0;
        const parts = message.split(' ');

        for (let index = 0; index < parts.length; index++) {
            let token = parts[index];
            const isLast = index === parts.length - 1;
            const lowerToken = token.toLowerCase();

            if (tokens[lowerToken]) {
                const tokenEntry = tokens[lowerToken];

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
                if (!isLast) {
                    messages.push(' ');
                }
            } else {
                messages.push(isLast ? token : token + ' ');
            }
        }

        return messages;
    };

    return <div>{getMessage()}</div>;
};

Messages.displayName = 'Messages';

export default Messages;
