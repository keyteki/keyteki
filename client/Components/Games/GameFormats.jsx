import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import './GameFormats.scss';

const GameFormats = ({ formProps }) => {
    const { t } = useTranslation();

    const formats = [
        { name: 'archon', label: t('Archon') },
        { name: 'alliance', label: t('Alliance') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') },
        { name: 'reversal', label: t('Reversal') }
    ];

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12} className='font-weight-bold'>
                        <Trans>Format</Trans>
                    </Col>
                    {formats.map((format) => (
                        <Col key={format.name} lg='4'>
                            <Form.Check
                                name='gameFormat'
                                type='radio'
                                id={format.name}
                                label={format.label}
                                onChange={formProps.handleChange}
                                value={format.name}
                                checked={formProps.values.gameFormat === format.name}
                            ></Form.Check>
                        </Col>
                    ))}
                </Form.Row>
                <Form.Control.Feedback type='invalid'>
                    {formProps.errors.gameFormat}
                </Form.Control.Feedback>
            </Form.Group>
        </>
    );
};

export default GameFormats;
