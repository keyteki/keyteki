import React from 'react';
import { Alert, CloseButton } from '@heroui/react';
import { useTranslation } from 'react-i18next';

const AlertSurfaceClassByStatus = {
    danger: 'border border-red-500/60 bg-red-900/40 text-red-100',
    success: 'border border-emerald-500/60 bg-emerald-900/40 text-emerald-100'
};

/**
 * @typedef ApiStatusProps
 * @property {Object} state the api response state
 * @property {function(): void} onClose Called when the alert is dismissed
 */

/**
 * @param {ApiStatusProps} props
 */
const ApiStatus = (props) => {
    const { t } = useTranslation();

    if (!props.state || props.state.loading) {
        return null;
    }

    let error;
    let index = 0;
    if (typeof props.state.message === 'object') {
        error = (
            <ul>
                {Object.values(props.state.message).map((message) => {
                    return <li key={index++}>{t(message)}</li>;
                })}
            </ul>
        );
    } else {
        error = t(props.state.message);
    }

    const status = props.state.success ? 'success' : 'danger';

    return (
        <Alert status={status} className={`${AlertSurfaceClassByStatus[status]} items-center`}>
            <Alert.Indicator className='text-inherit' />
            <Alert.Content className='flex-1 text-center'>
                <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
            {!!props.onClose && (
                <CloseButton
                    aria-label={t('Close status')}
                    className='ml-auto text-inherit'
                    onPress={props.onClose}
                />
            )}
        </Alert>
    );
};

export default ApiStatus;
