import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import './GameSets.scss';

const GameSets = ({ formProps }) => {
    const { t } = useTranslation();

    let expansions = [
        { name: 'cota', label: t('Call of the Archons') },
        { name: 'aoa', label: t('Age of Ascension') },
        { name: 'wc', label: t('Worlds Collide') },
        { name: 'mm', label: t('Mass Mutation') },
        { name: 'dt', label: t('Dark Tidings') },
        { name: 'woe', label: t('Winds of Exchange') },
        { name: 'gr', label: t('Grim Reminders') },
        { name: 'as', label: t('Æmber Skies') },
        { name: 'toc', label: t('Tokens of Change') },
        { name: 'momu', label: t('More Mutation') },
        { name: 'disc', label: t('Discovery') },
        { name: 'pv', label: t('Prophetic Visions') },
        { name: 'cc', label: t('Crucible Clash') },
        { name: 'vm2023', label: t('Vault Masters 2023') },
        { name: 'vm2024', label: t('Vault Masters 2024') },
        { name: 'vm2025', label: t('Vault Masters 2025') }
    ];

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12} className='font-weight-bold'>
                        <Trans>Sets</Trans>
                    </Col>
                    {expansions.map((expansion) => (
                        <Col key={expansion.name} lg='4'>
                            <Form.Check
                                type='switch'
                                id={expansion.name}
                                label={expansion.label}
                                onChange={formProps.handleChange}
                                value='true'
                                checked={formProps.values[expansion.name]}
                            ></Form.Check>
                        </Col>
                    ))}
                </Form.Row>
            </Form.Group>
        </>
    );
};

export default GameSets;
