import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { Card, CardHeader, CardBody } from '@heroui/react';

export const PanelType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger'
});

const Panel = forwardRef(function Panel(
    { className, type = PanelType.Primary, title, children },
    ref
) {
    let border = 'border-default';
    if (type === PanelType.Primary) {
        border = 'border-primary';
    } else if (type === PanelType.Info) {
        border = 'border-info';
    } else if (type === PanelType.Warning) {
        border = 'border-warning';
    } else if (type === PanelType.Danger) {
        border = 'border-danger';
    }

    const cardClass = classNames('shadow-lg border-2 bg-black/65 h-full', className, border);
    const titleClass = classNames(
        'justify-center rounded-none font-bold',
        `bg-${type} panel-texture-primary`
    );
    return (
        <Card className={cardClass} classNames={{ body: 'h-full overflow-y-auto' }} ref={ref}>
            {title && <CardHeader className={titleClass}>{title}</CardHeader>}

            <CardBody>{children}</CardBody>
        </Card>
    );
});

export default Panel;
