import React from 'react';

import { Card, CardHeader, CardBody } from '@heroui/react';

/**
 * @typedef PanelProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 * @property {string} [className]
 * @property {string} [title]
 * @property {string} [titleClass]
 */

/**
 * @param {PanelProps} props
 */
const Panel = ({ title, titleClass, className, children }) => {
    const panelClass = `${className || ''}`;

    return (
        <Card
            className={`${panelClass} bg-black/80 shadow-[3px_3px_5px_#371c1c] font-[Keyforge,_Helvetica,_sans-serif]`}
            radius='sm'
            shadow='sm'
        >
            {title && (
                <CardHeader
                    className={`text-center text-white panel-texture-primary ${titleClass || ''}`}
                >
                    {title}
                </CardHeader>
            )}
            <CardBody>{children}</CardBody>
        </Card>
    );
};

export default Panel;
