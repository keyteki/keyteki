import { Link } from '@heroui/react';
import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import NavigationLink from '../Site/NavigationLink';

const NavItem = forwardRef(function NavItem(
    { className, children, size = 'lg', path, ...props },
    ref
) {
    const { path: currentPath } = useSelector((state) => state.navigation);
    return (
        <Link
            className={classNames(
                'cursor-pointer font-[PoppinsMedium] text-secondary transition-colors duration-500 ease-in-out hover:text-white',
                {
                    'brightness-150': path && path === currentPath
                },
                className
            )}
            size={size}
            as={path && NavigationLink}
            href={path}
            ref={ref}
            {...props}
        >
            {children}
        </Link>
    );
});

export default NavItem;
