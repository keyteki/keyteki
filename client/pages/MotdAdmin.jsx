import React, { useState } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { sendSocketMessage } from '../redux/actions';

import Panel from '../Components/Site/Panel';

const MotdAdmin = () => {
    const motdTypes = [
        { value: 'error', label: 'Error (red)' },
        { value: 'warning', label: 'Warning (yellow)' },
        { value: 'info', label: 'Info (blue)' },
        { value: 'success', label: 'Success (green)' }
    ];

    const motd = useSelector((state) => state.lobby.motd);

    let [motdText, setMotdText] = useState(motd?.message);
    let [motdType, setMotdType] = useState(motd?.motdType ?? 'info');

    const dispatch = useDispatch();

    return (
        <Col sm={{ span: 8, offset: 2 }}>
            <Panel title='Motd administration'>
                <Form>
                    <Form.Group controlId='motd' as={Col} xs={12}>
                        <Form.Control
                            as='textarea'
                            rows={4}
                            value={motdText}
                            placeholder='Enter a motd message'
                            onChange={(event) => setMotdText(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        {motdTypes.map((type) => (
                            <Form.Check
                                name='gameType'
                                key={type.value}
                                type='radio'
                                id={type.value}
                                label={type.label}
                                inline
                                onChange={() => setMotdType(type.value)}
                                value={type.value}
                                checked={motdType === type.value}
                            ></Form.Check>
                        ))}
                    </Form.Group>

                    <div className='text-center'>
                        <Button
                            className='btn btn-primary'
                            type='button'
                            onClick={() =>
                                dispatch(
                                    sendSocketMessage('motd', {
                                        message: motdText,
                                        motdType: motdType
                                    })
                                )
                            }
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </Panel>
        </Col>
    );
};

MotdAdmin.displayName = 'MotdAdmin';

export default MotdAdmin;
