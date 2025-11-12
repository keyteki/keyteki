import classNames from 'classnames';
import React, { forwardRef } from 'react';

const Page = forwardRef(function Page({ className, children, size = 'normal' }, ref) {
    const wrapperClassName = classNames(
        'p-2 mx-auto w-full flex flex-col gap-1',
        {
            'md:w-3/5 lg:w-2/5': size === 'small',
            'lg:w-4/5': size === 'normal'
        },
        className
    );
    return (
        <div className={wrapperClassName} ref={ref}>
            {children}
        </div>
    );
});

export default Page;
