import React from 'react';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './TagPill.scss';

/**
 * @typedef TagPillProps
 * @property {Object} tag - The tag object { id, name, color }
 * @property {boolean} [removable] - Whether the tag can be removed
 * @property {function} [onRemove] - Callback when tag is removed
 * @property {boolean} [clickable] - Whether the tag is clickable for toggling
 * @property {function} [onClick] - Callback when tag is clicked
 * @property {boolean} [isSelected] - Whether the tag is selected (for filtering)
 */

/**
 * @param {TagPillProps} props
 */
const TagPill = ({
    tag,
    removable = false,
    onRemove,
    clickable = false,
    onClick,
    isSelected = false
}) => {
    const handleRemoveClick = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(tag);
        }
    };

    const handleClick = () => {
        if (clickable && onClick) {
            onClick(tag);
        }
    };

    const pillClasses = [
        'tag-pill',
        clickable ? 'tag-pill-clickable' : '',
        isSelected ? 'tag-pill-selected' : ''
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Badge
            className={pillClasses}
            style={{
                backgroundColor: tag.color,
                color: getContrastColor(tag.color),
                cursor: clickable ? 'pointer' : 'default'
            }}
            onClick={handleClick}
        >
            {tag.name}
            {removable && (
                <FontAwesomeIcon
                    icon={faTimes}
                    className='tag-pill-remove ml-1'
                    onClick={handleRemoveClick}
                />
            )}
        </Badge>
    );
};

// Helper function to determine if white or black text should be used
function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

TagPill.displayName = 'TagPill';

export default TagPill;
