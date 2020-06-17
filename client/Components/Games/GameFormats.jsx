import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';

const GameFormats = ({ formProps }) => {
    const { t } = useTranslation();

    const formats = [
        { name: 'normal', label: t('Normal') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'reversal', label: t('Reversal') },
        { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') }
    ];

    let expansions = [
        { name: 'cota', label: t('Call of the Archons') },
        { name: 'aoa', label: t('Age of Ascension') },
        { name: 'wc', label: t('Worlds Collide') }
    ];

    return (
        <>
            <Form.Row>
                <Col xs={12} className='font-weight-bold'>
                    <Trans>Format</Trans>
                </Col>
                <Col>
                    {formats.map((format) => (
                        <Form.Check
                            name='gameFormat'
                            key={format.name}
                            type='radio'
                            id={format.name}
                            label={format.label}
                            inline
                            onChange={formProps.handleChange}
                            value={format.name}
                            checked={formProps.values.gameFormat === format.name}
                        ></Form.Check>
                    ))}
                </Col>
            </Form.Row>
            {formProps.values.gameFormat === 'sealed' && (
                <Form.Row>
                    {expansions.map((expansion) => {
                        return (
                            <>
                                <Form.Check
                                    key={expansion.name}
                                    type='switch'
                                    id={expansion.name}
                                    label={expansion.label}
                                    inline
                                    onChange={formProps.handleChange}
                                    value='true'
                                    checked={formProps.values[expansion.name]}
                                ></Form.Check>
                                <Form.Control.Feedback type='invalid'></Form.Control.Feedback>
                            </>
                        );
                    })}
                </Form.Row>
            )}
        </>
    );
};

export default GameFormats;
