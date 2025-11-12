import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/slices/navigationSlice';

/**
 * @param {Object} props
 * @param {import('react').ReactNode | string} props.children
 * @param {string} [props.className]
 * @param {string} props.href
 */
const Link = ({ children, className, href }) => {
    const dispatch = useDispatch();

    /**
     * @param {import('react').MouseEvent<HTMLAnchorElement>} event
     */
    const onClick = (event) => {
        event.preventDefault();
        dispatch(navigate(href));
    };

    return (
        <a href={href} className={className} onClick={onClick}>
            {children}
        </a>
    );
};

Link.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string,
    href: PropTypes.string
};

export default Link;
