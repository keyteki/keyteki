import React from 'react';
import Button from '../HeroUI/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FaIconButton = ({ icon, color = 'default', size = 'sm', variant = 'flat', onPress }) => {
    return (
        <Button isIconOnly color={color} size={size} variant={variant} onPress={onPress}>
            <FontAwesomeIcon icon={icon} />
        </Button>
    );
};

FaIconButton.displayName = 'FaIconButton';
export default FaIconButton;
