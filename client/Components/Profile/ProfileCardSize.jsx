import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import CardSizeOption from './CardSizeOption';

/**
 * @typedef ProfileCardSizeOption
 * @property {string} name The name of the option used in the database
 * @property {string} label The card size option label displayed to the user
 */

/**
 * @typedef CardSizeProps
 * @property {ProfileCardSizeOption[]} cardSizes The list of available card sizes
 * @property {string} selectedCardSize The currently selected card size
 * @property {function(string): void} onCardSizeSelected Called when the selected card size is changed
 */

/**
 * @param {CardSizeProps} props
 * @returns {React.FC<CardSizeProps>}
 */
const ProfileCardSize = (props) => {
    const { t } = useTranslation();
    const { cardSizes, selectedCardSize, onCardSizeSelected } = props;

    return (
        <Panel title={t('Card Image Size')}>
            <Row>
                <Col xs='12'>
                    {cardSizes.map((cardSize) => (
                        <CardSizeOption
                            key={cardSize.name}
                            label={cardSize.label}
                            name={cardSize.name}
                            onSelect={onCardSizeSelected}
                            selected={selectedCardSize === cardSize.name}
                        />
                    ))}
                </Col>
            </Row>
        </Panel>
    );
};

export default ProfileCardSize;
