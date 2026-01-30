import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Form, Row } from 'react-bootstrap';

import './GameFormats.scss';

const GameFormats = ({ formProps }) => {
    const { t } = useTranslation();

    const formats = [
        { name: 'normal', label: t('Normal') },
        { name: 'unchained', label: t('Unchained') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'reversal', label: t('Reversal') },
        { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') },
        { name: 'alliance', label: t('Alliance') }
    ];

    let expansions = [
        { name: 'cota', label: t('Call of the Archons') },
        { name: 'aoa', label: t('Age of Ascension') },
        { name: 'wc', label: t('Worlds Collide') },
        { name: 'mm', label: t('Mass Mutation') },
        { name: 'dt', label: t('Dark Tidings') },
        { name: 'woe', label: t('Winds of Exchange') },
        { name: 'gr', label: t('Grim Reminders') },
        { name: 'as', label: t('�mber Skies') },
        { name: 'toc', label: t('Tokens of Change') },
        { name: 'momu', label: t('More Mutation') },
        { name: 'disc', label: t('Discovery') },
        { name: 'vm2023', label: t('Vault Masters 2023') },
        { name: 'vm2024', label: t('Vault Masters 2024') },
        { name: 'vm2025', label: t('Vault Masters 2025') },
        { name: 'pv', label: t('Prophetic Visions') },
        { name: 'cc', label: t('Crucible Clash') }
    ];

    return (
        <>
            <Row>
                <Col xs={12} className='font-weight-bold'>
                    <Trans>Format</Trans>
                </Col>
                <Form.Group as={Col}>
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
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.gameFormat}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            {formProps.values.gameFormat === 'sealed' && (
                <Row>
                    <Form.Group className='game-formats' as={Col}>
                        {expansions.map((expansion) => {
                            return (
                                <Form.Check
                                    key={expansion.name}
                                    type='switch'
                                    id={expansion.name}
                                    label={expansion.label}
                                    onChange={formProps.handleChange}
                                    value='true'
                                    checked={formProps.values[expansion.name]}
                                ></Form.Check>
                            );
                        })}
                    </Form.Group>
                </Row>
            )}
        </>
    );
};

export default GameFormats;
