import React from 'react';

import './Panel.scss';
import { Card } from 'react-bootstrap';

/** 
 * @typedef {'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'} PanelType
 */

const PanelType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger'
});

/**
 * @typedef PanelProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 * @property {string} [className]
 * @property {string} [title]
 * @property {string} [titleClass]
 * @property {string} [type]
 */

/**
 * @param {PanelProps} props
 */
const Panel = ({ type = PanelType.Primary, title, children }) => {
    /** @type {PanelType} */
    let retType;

    switch (type) {
        case PanelType.Primary:
            retType = 'primary';
            break;
        case PanelType.Default:
            retType = 'secondary';
            break;
        case PanelType.Info:
            retType = 'info';
            break;
        case PanelType.Warning:
            retType = 'warning';
            break;
        case PanelType.Danger:
            retType = 'danger';
            break;
        default:
            retType = 'primary';
            break;
    }

    return (
        <Card border={retType} bg='dark'>
            {title && <Card.Header className='text-center'>{title}</Card.Header>}
            <Card.Body>{children}</Card.Body>
        </Card>
    );
};

export default Panel;
