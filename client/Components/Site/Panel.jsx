import React from 'react';
import { Card } from '@heroui/react';

/**
 * @typedef PanelProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 * @property {string} [className]
 * @property {string} [contentClassName]
 * @property {string} [headerClassName]
 * @property {string} [headerTextClassName]
 * @property {string} [title]
 * @property {string} [titleClass]
 * @property {string} [type]
 */

/**
 * @param {PanelProps} props
 */
const Panel = ({
    title,
    titleClass,
    children,
    className,
    contentClassName,
    headerClassName,
    headerTextClassName
}) => {
    const baseClass =
        'min-h-0 flex flex-col !p-0 !gap-0 rounded-md border border-border/75 !bg-surface !text-foreground shadow-[var(--surface-shadow)]';
    let contentClass =
        'min-h-0 flex flex-1 flex-col overflow-hidden px-3 py-2 text-foreground [&_label]:!text-foreground [&_.form-label]:!text-foreground';
    if (contentClassName) {
        contentClass += ` ${contentClassName}`;
    }
    const headerBaseClass = 'w-full !p-0 !m-0 rounded-tr-md rounded-tl-md flex items-center';
    const headerTextClass = headerTextClassName || 'text-[color:var(--brand-red)] dark:text-accent';
    const headerClass =
        headerClassName ||
        'border-b border-border/45 bg-surface [box-shadow:inset_0_1px_0_color-mix(in_oklab,var(--brand-red)_62%,transparent)]';
    const headerInnerClass = 'w-full px-3 py-0.5 flex items-center justify-center min-h-6';

    return (
        <Card className={`${baseClass}${className ? ` ${className}` : ''}`}>
            {title && (
                <Card.Header
                    className={`${headerBaseClass} ${headerClass} text-center ${headerTextClass} font-normal${
                        titleClass ? ` ${titleClass}` : ''
                    }`}
                >
                    <div className={headerInnerClass}>
                        <Card.Title
                            className={`!m-0 w-full min-h-6 text-center font-normal !leading-none flex items-center justify-center ${headerTextClass}`}
                        >
                            {title}
                        </Card.Title>
                    </div>
                </Card.Header>
            )}
            <Card.Content className={contentClass}>{children}</Card.Content>
        </Card>
    );
};

export default Panel;
