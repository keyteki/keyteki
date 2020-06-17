import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';
import { getStandardControlProps } from '../../util';

const GameOptions = ({ formProps }) => {
    const { t } = useTranslation();

    const options = [
        { name: 'allowSpectators', label: t('Allow spectators') },
        { name: 'showHands', label: t('Show hands to spectators') },
        { name: 'muteSpectators', label: t('Mute spectators') },
        { name: 'timeLimit', label: t('Use a time limit (in minutes)') },
        { name: 'gamePrivate', label: t('Private (requires game link)') },
        { name: 'hideDecklists', label: t('Hide opponent decklists') }
    ];

    return (
        <>
            <Form.Row>
                <Col xs={12} className='font-weight-bold'>
                    <Trans>Options</Trans>
                </Col>
                {options.map((option) => (
                    <Col key={option.name} lg='4'>
                        <Form.Check
                            type='switch'
                            id={option.name}
                            label={option.label}
                            inline
                            onChange={formProps.handleChange}
                            value='true'
                            checked={formProps.values[option.name]}
                        ></Form.Check>
                    </Col>
                ))}
            </Form.Row>
            {formProps.values.timeLimit && (
                <Form.Row>
                    <Form.Group as={Col} sm={4}>
                        <Form.Label>{t('Time Limit')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('Enter time limit')}
                            {...getStandardControlProps(formProps, 'gameTimeLimit')}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formProps.errors.gameTimeLimit}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
            )}
        </>
    );
};

export default GameOptions;
