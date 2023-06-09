import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/actions';

const Link = ({ children, className, href }) => {
    const dispatch = useDispatch();

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
    classname: PropTypes.string,
    href: PropTypes.string
};

export default Link;
