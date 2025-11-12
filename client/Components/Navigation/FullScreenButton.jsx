import React, { useState } from 'react';
import {
    faDownLeftAndUpRightToCenter,
    faUpRightAndDownLeftFromCenter
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@heroui/react';
import screenfull from 'screenfull';

const FullScreenButton = () => {
    const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
    return (
        <Button
            variant='flat'
            onPress={() => {
                if (screenfull.isEnabled) {
                    screenfull.toggle();
                    setIsFullscreen(!isFullscreen);
                }
            }}
            startContent={
                <FontAwesomeIcon
                    icon={
                        isFullscreen ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter
                    }
                />
            }
            isIconOnly={true}
        />
    );
};

export default FullScreenButton;
