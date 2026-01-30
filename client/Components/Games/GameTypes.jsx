import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Form, Row } from 'react-bootstrap';

import GameTypeInfo from './GameTypeInfo';

const GameTypes = ({ formProps }) => {
    const { t } = useTranslation();

    let types = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') }
    ];

    return (
        <>
            <Row>
                <Col xs={12}>
                    <GameTypeInfo gameType={formProps.values.gameType} />
                </Col>
            </Row>
            <Row>
                <Col xs={12} className='font-weight-bold'>
                    <Trans>Type</Trans>
                </Col>
                <Form.Group as={Col}>
                    {types.map((type) => (
                        <Form.Check
                            name='gameType'
                            key={type.name}
                            type='radio'
                            id={type.name}
                            label={type.label}
                            inline
                            onChange={formProps.handleChange}
                            value={type.name}
                            checked={formProps.values.gameType === type.name}
                        ></Form.Check>
                    ))}
                </Form.Group>
            </Row>
        </>
    );
};

export default GameTypes;
