import React from 'react';
import Icon from '../Icon';
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
    accent: 'border border-slate-300 bg-slate-100 text-slate-800 dark:border-sky-500/50 dark:bg-sky-900/30 dark:text-sky-100',
    danger: 'border border-red-300 bg-red-100 text-red-900 dark:border-red-500/60 dark:bg-red-900/40 dark:text-red-100',
    success:
        'border border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-500/60 dark:bg-emerald-900/40 dark:text-emerald-100',
    warning:
        'border border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-500/60 dark:bg-amber-900/45 dark:text-amber-100'
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
                    <Icon icon={icon} />
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
