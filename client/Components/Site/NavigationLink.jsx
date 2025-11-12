import React, { forwardRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/slices/navigationSlice';

const NavigationLink = forwardRef(function NavigationLink({ href, className, children }, ref) {
    const dispatch = useDispatch();

    const onPointerDown = useCallback(
        (event) => {
            event.preventDefault();
            dispatch(navigate(href));
        },
        [dispatch, href]
    );

    return (
        <a
            className={className}
            href={href}
            onClick={onPointerDown}
            onPointerDown={onPointerDown}
            ref={ref}
        >
            {children}
        </a>
    );
});

export default NavigationLink;
