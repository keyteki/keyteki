import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import GamePlaystileInfo from './GamePlaystyleInfo';

const GamePlaystyles = ({ formProps }) => {
    const { t } = useTranslation();

    let types = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') },
        { name: 'uncharted-lands', label: t('Uncharted Lands') }
    ];

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12} className='font-weight-bold'>
                        <Trans>Playstyle</Trans>
                    </Col>
                    {types.map((type) => (
                        <Col key={type.name} lg='3'>
                            <Form.Check
                                name='gamePlaystyle'
                                type='radio'
                                id={type.name}
                                label={type.label}
                                onChange={formProps.handleChange}
                                value={type.name}
                                checked={formProps.values.gamePlaystyle === type.name}
                            ></Form.Check>
                        </Col>
                    ))}
                </Form.Row>
            </Form.Group>
            <Form.Row>
                <Col xs={12}>
                    <GamePlaystileInfo gamePlaystyle={formProps.values.gamePlaystyle} />
                </Col>
            </Form.Row>
        </>
    );
};

export default GamePlaystyles;
