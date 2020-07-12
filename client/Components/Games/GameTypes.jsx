import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';

const GameTypes = ({ formProps }) => {
    const { t } = useTranslation();

    let types = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') }
    ];

    return (
        <Form.Row>
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
        </Form.Row>
    );
};

export default GameTypes;
