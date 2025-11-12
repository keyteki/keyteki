import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ErrorMessage = ({ includeIcon = true, title, message, color = 'white' }) => {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='text-center'>
                {includeIcon && (
                    <FontAwesomeIcon icon={faExclamationTriangle} size='5x' color={color} />
                )}
                {title && <h1 className='text-large'>{title}</h1>}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ErrorMessage;
