import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle,
    faBell
} from '@fortawesome/free-solid-svg-icons';

export const AlertType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger',
    Success: 'success',
    Bell: 'bell'
});

/**
 * @typedef {Object} AlertPanelProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 * @property {string} [className]
 * @property {string} [title]
 * @property {string} [message]
 * @property {boolean} [noIcon]
 * @property {string} [titleClass]
 * @property {string} [type]
 */

function getMessageWithLinks(message) {
    let links = message.match(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi);
    let retMessage = [];

    if (!links || links.length === 0) {
        return message;
    }

    let lastIndex = 0;
    let linkCount = 0;

    for (let link of links) {
        let index = message.indexOf(link);

        retMessage.push(message.substring(lastIndex, index));
        retMessage.push(
            <a key={linkCount++} href={link} className='text-blue-600 hover:underline'>
                {link}
            </a>
        );

        lastIndex += index + link.length;
    }

    retMessage.push(message.substr(lastIndex, message.length - lastIndex));

    return retMessage;
}

const AlertPanel = ({ type = AlertType.Info, title, message, noIcon = false, children }) => {
    let icon;
    let bgColor;
    let borderColor;
    let textColor;

    switch (type) {
        case AlertType.Warning:
            icon = faExclamationTriangle;
            bgColor = 'bg-yellow-50';
            borderColor = 'border-yellow-400';
            textColor = 'text-yellow-800';
            break;
        case AlertType.Danger:
            icon = faExclamationCircle;
            bgColor = 'bg-red-50';
            borderColor = 'border-red-400';
            textColor = 'text-red-800';
            break;
        case AlertType.Info:
            icon = faInfoCircle;
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-400';
            textColor = 'text-blue-800';
            break;
        case AlertType.Success:
            icon = faCheckCircle;
            bgColor = 'bg-green-50';
            borderColor = 'border-green-400';
            textColor = 'text-green-800';
            break;
        case AlertType.Bell:
            icon = faBell;
            bgColor = 'bg-indigo-50';
            borderColor = 'border-indigo-400';
            textColor = 'text-indigo-800';
            break;
    }

    return (
        <div className={`${bgColor} ${borderColor} ${textColor} border-l-4 p-4 mb-4`} role='alert'>
            {title && <div className='font-bold mb-2'>{title}</div>}
            <div>
                {!noIcon && <FontAwesomeIcon icon={icon} />}
                {message && <span id='alert-message'>&nbsp;{getMessageWithLinks(message)}</span>}
                {children && <span>&nbsp;{children}</span>}
            </div>
        </div>
    );
};

AlertPanel.displayName = 'AlertPanel';

export default AlertPanel;
