import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const isExternalLink = (href) =>
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    /^https?:\/\//i.test(href);

const Link = React.forwardRef(({ children, className, href }, ref) => {
    if (isExternalLink(href)) {
        return (
            <a ref={ref} href={href} className={className}>
                {children}
            </a>
        );
    }

    return (
        <RouterLink ref={ref} to={href} className={className}>
            {children}
        </RouterLink>
    );
});

Link.displayName = 'Link';

Link.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    className: PropTypes.string,
    href: PropTypes.string
};

export default Link;
