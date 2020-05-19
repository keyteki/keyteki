import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const ServerStatus = (props) => {
    const { connecting, connected, responseTime, serverType } = props;
    const { t } = useTranslation();

    let className = 'glyphicon';
    let toolTip = `${serverType} is`;
    let pingText;

    if (connected) {
        className += ' glyphicon-ok-circle text-success';
        toolTip += ' connected';

        let pingClass;

        if (responseTime === undefined) {
            pingText = <span>{t('Waiting for ping')}</span>;
        } else {
            if (responseTime < 150) {
                pingClass = 'text-success';
            } else if (responseTime < 300) {
                pingClass = 'text-warning';
            } else {
                pingClass = 'text-danger';
            }

            pingText = (
                <React.Fragment>
                    <span>{serverType}: </span>
                    <span className={pingClass}>{responseTime}ms</span>
                </React.Fragment>
            );
        }
    } else if (connecting) {
        className += ' glyphicon-remove-circle text-warning';
        toolTip += ' connecting';
        pingText = (
            <React.Fragment>
                <span>{serverType}: </span>
                <span className='text-warning'>{t('Connecting')}</span>
            </React.Fragment>
        );
    } else {
        className += ' glyphicon-ban-circle text-danger';
        toolTip += ' disconnected';
        pingText = (
            <React.Fragment>
                <span>{serverType}: </span>
                <span className='text-danger'>{t('Disconnected')}</span>
            </React.Fragment>
        );
    }

    return (
        <li className='server-status'>
            {pingText}
            <span className={className} title={t(toolTip)} />
        </li>
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
