import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle,
    faBell
} from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@heroui/react';

const AlertType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger',
    Success: 'success',
    Bell: 'bell'
});

const AlertSurfaceClassByStatus = {
    accent: 'border border-cyan-500/60 bg-cyan-900/40 text-cyan-100',
    danger: 'border border-red-500/60 bg-red-900/40 text-red-100',
    success: 'border border-emerald-500/60 bg-emerald-900/40 text-emerald-100',
    warning: 'border border-amber-500/60 bg-amber-900/45 text-amber-100'
};

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

/**
 * @param {string} message
 */
function getMessageWithLinks(message) {
    const links = message.match(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi);
    const retMessage = [];

    if (!links || links.length === 0) {
        return message;
    }

    let lastIndex = 0;
    let linkCount = 0;

    for (const link of links) {
        const index = message.indexOf(link, lastIndex);

        retMessage.push(message.substring(lastIndex, index));
        retMessage.push(
            <a
                key={linkCount++}
                href={link}
                rel='noopener noreferrer'
                target='_blank'
                className='text-inherit underline'
            >
                {link}
            </a>
        );

        lastIndex = index + link.length;
    }

    retMessage.push(message.substr(lastIndex, message.length - lastIndex));

    return retMessage;
}

/**
 * @param {AlertPanelProps} props
 */
const AlertPanel = ({
    type = AlertType.Info,
    title,
    message,
    noIcon = false,
    children,
    className
}) => {
    let icon;
    /**
     * @type {AlertType}
     */
    let alertType;

    switch (type) {
        case 'error':
        case AlertType.Warning:
            icon = faExclamationTriangle;
            alertType = 'warning';
            break;
        case AlertType.Danger:
            icon = faExclamationCircle;
            alertType = 'danger';
            break;
        case AlertType.Info:
            icon = faInfoCircle;
            alertType = 'accent';
            break;
        case AlertType.Success:
            icon = faCheckCircle;
            alertType = 'success';
            break;
        case AlertType.Bell:
            icon = faBell;
            alertType = 'accent';
            break;
        case AlertType.Default:
        case AlertType.Primary:
        default:
            icon = faInfoCircle;
            alertType = 'accent';
            break;
    }

    return (
        <Alert
            status={alertType}
            className={`mb-2 ${AlertSurfaceClassByStatus[alertType]}${
                className ? ` ${className}` : ''
            }`}
        >
            {!noIcon && (
                <Alert.Indicator className='text-inherit'>
                    <FontAwesomeIcon icon={icon} />
                </Alert.Indicator>
            )}
            <Alert.Content>
                {title && <Alert.Title>{title}</Alert.Title>}
                {(message || children) && (
                    <Alert.Description>
                        {message && <span id='alert-message'>{getMessageWithLinks(message)}</span>}
                        {children && (
                            <span>
                                {message ? ' ' : null}
                                {children}
                            </span>
                        )}
                    </Alert.Description>
                )}
            </Alert.Content>
        </Alert>
    );
};

AlertPanel.displayName = 'AlertPanel';

export default AlertPanel;
