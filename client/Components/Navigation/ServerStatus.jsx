import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';

import './ServerStatus.scss';
import NavbarItem from './NavbarItem';

const ServerStatus = (props) => {
    const { connecting, connected, responseTime, serverType } = props;
    const { t } = useTranslation();

    const connectionStatus = t(
        (connected && 'Connected') || (connecting && 'Connecting') || 'Disconnected'
    );

    const connectionIcon = (connected && faCheckCircle) || (connecting && faTimesCircle) || faBan;

    const toolTip = `${serverType} is ${connectionStatus}`;

    const pingLevel = `ping-${
        connected
            ? responseTime
                ? (responseTime < 150 && 'good') || (responseTime < 300 && 'mid') || 'bad'
                : 'neutral'
            : connecting
            ? 'mid'
            : 'bad'
    }`;

    const pingText2 = `${serverType}: ${
        connected ? (responseTime ? `${responseTime}ms` : 'Waiting for ping') : connectionStatus
    }`;

    return (
        <NavbarItem>
            <span className={pingLevel}>
                {pingText2} <FontAwesomeIcon icon={connectionIcon} title={t(toolTip)} />
            </span>
        </NavbarItem>
    );
};

ServerStatus.displayName = 'ServerStatus';
ServerStatus.propTypes = {
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    responseTime: PropTypes.number,
    serverType: PropTypes.string
};

export default ServerStatus;
