import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';

/** 
 * @typedef {'primary'
 | 'secondary'
 | 'success'
 | 'danger'
 | 'warning'
 | 'info'
 | 'dark'
 | 'light'} AlertType
*/

const AlertType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger',
    Success: 'success'
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

/**
 * @param {string} message
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
            <Alert.Link key={linkCount++} href={link}>
                {link}
            </Alert.Link>
        );

        lastIndex += index + link.length;
    }

    retMessage.push(message.substr(lastIndex, message.length - lastIndex));

    return retMessage;
}

/**
 * @param {AlertPanelProps} props
 */
const AlertPanel = ({ type = AlertType.Info, title, message, noIcon = false, children }) => {
    let icon;
    /**
     * @type {AlertType}
     */
    let alertType;

    switch (type) {
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
            alertType = 'info';
            break;
        case AlertType.Success:
            icon = faCheckCircle;
            alertType = 'success';
            break;
    }

    return (
        <Alert variant={alertType}>
            {title && <Alert.Heading>{title}</Alert.Heading>}
            {!noIcon && <FontAwesomeIcon icon={icon} />}
            {message && <span id='alert-message'>&nbsp;{getMessageWithLinks(message)}</span>}
            {children && <span>&nbsp;{children}</span>}
        </Alert>
    );
};

AlertPanel.displayName = 'AlertPanel';

export default AlertPanel;
