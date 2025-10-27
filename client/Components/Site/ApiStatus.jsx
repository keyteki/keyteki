import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

const ApiStatus = (props) => {
    const { t } = useTranslation();

    if (!props.state || props.state.loading) {
        return null;
    }

    let error;
    let index = 0;
    if (typeof props.state.message === 'object') {
        error = (
            <ul className='list-disc pl-5'>
                {Object.values(props.state.message).map((message) => {
                    return <li key={index++}>{t(message)}</li>;
                })}
            </ul>
        );
    } else {
        error = t(props.state.message);
    }

    const isSuccess = props.state.success;
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-400' : 'border-red-400';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const icon = isSuccess ? faCheckCircle : faExclamationCircle;

    return (
        <div
            className={`${bgColor} ${borderColor} ${textColor} border-l-4 p-4 mb-4 relative`}
            role='alert'
        >
            <div className='flex items-start'>
                <FontAwesomeIcon icon={icon} className='mr-2 mt-1' />
                <div className='flex-1'>{error}</div>
                {props.onClose && (
                    <button
                        onClick={props.onClose}
                        className='ml-4 text-current hover:opacity-70'
                        aria-label='Close'
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ApiStatus;
