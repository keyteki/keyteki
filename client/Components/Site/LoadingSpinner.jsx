import React from 'react';
import { Spinner } from '@heroui/react';

const LoadingSpinner = ({ label }) => {
    return (
        <div className='flex items-center justify-center py-4 gap-2'>
            <Spinner size='sm' />
            {label && <span className='text-sm text-foreground-500'>{label}</span>}
        </div>
    );
};

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;
