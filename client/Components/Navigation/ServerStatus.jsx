import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';

const ServerStatus = (props) => {
    const { connecting, connected, responseTime, serverType, mobile = false } = props;
    const { t } = useTranslation();

    const connectionStatus = t(
        (connected && 'Connected') || (connecting && 'Connecting') || 'Disconnected'
    );

    const connectionIcon = (connected && faCheckCircle) || (connecting && faTimesCircle) || faBan;

    const toolTip = `${serverType} is ${connectionStatus}`;

    const pingLevel = `text-${
        connected
            ? responseTime
                ? (responseTime < 150 && 'success') || (responseTime < 300 && 'warning') || 'danger'
                : 'neutral'
            : connecting
            ? 'warning'
            : 'danger'
    }`;

    const pingText = `${serverType[0]}: ${
        connected ? (responseTime ? `${responseTime}ms` : 'Waiting') : connectionStatus
    }`;

    return (
        <div
            className={
                mobile
                    ? 'inline-flex h-9 items-center px-3 text-sm font-medium'
                    : 'inline-flex h-9 items-center px-3 text-sm font-medium lg:h-[50px]'
            }
        >
            <span className={pingLevel}>
                {pingText} <FontAwesomeIcon icon={connectionIcon} title={t(toolTip)} />
            </span>
        </div>
    );
};

ServerStatus.displayName = 'ServerStatus';
ServerStatus.propTypes = {
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    mobile: PropTypes.bool,
    responseTime: PropTypes.number,
    serverType: PropTypes.string
};

export default ServerStatus;
