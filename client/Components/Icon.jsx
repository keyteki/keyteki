import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Icon = React.forwardRef(({ label, title, ...props }, ref) => {
    const accessibleLabel = label ?? title;

    return (
        <FontAwesomeIcon
            ref={ref}
            title={title ?? label}
            aria-label={accessibleLabel}
            aria-hidden={accessibleLabel ? undefined : true}
            {...props}
        />
    );
});

Icon.displayName = 'Icon';

export default Icon;
