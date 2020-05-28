import React from 'react';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import GameBackgroundOption from './GameBackgroundOption';

/**
 * @typedef BackgroundOption
 * @property {string} name The name stored in the database
 * @property {string} label The label displayed to the user
 * @property {string} imageUrl The URL of the image for this background
 */

/**
 * @typedef BackgroundProps
 * @property {BackgroundOption[]} backgrounds The list of available backgrounds
 * @property {string} selectedBackground The currently selected background
 * @property {function(string): void} onBackgroundSelected Called when a background is selected
 */

/**
 * @param {BackgroundProps} props
 */
const ProfileBackground = (props) => {
    const { t } = useTranslation();
    const { backgrounds, selectedBackground, onBackgroundSelected } = props;

    return (
        <Panel title={t('Game Board Background')}>
            <Row>
                {backgrounds.map((background) => (
                    <GameBackgroundOption
                        imageUrl={background.imageUrl}
                        key={background.name}
                        label={background.label}
                        name={background.name}
                        onSelect={onBackgroundSelected}
                        selected={selectedBackground === background.name}
                    />
                ))}
            </Row>
        </Panel>
    );
};

export default ProfileBackground;
