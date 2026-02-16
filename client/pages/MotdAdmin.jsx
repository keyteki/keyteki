import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextArea } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import { lobbySendMessage } from '../redux/socketActions';

const MotdAdmin = () => {
    const motdTypes = [
        { value: 'error', label: 'Error (red)' },
        { value: 'warning', label: 'Warning (yellow)' },
        { value: 'info', label: 'Info (blue)' },
        { value: 'success', label: 'Success (green)' }
    ];

    const motd = useSelector((state) => state.lobby.motd);

    const [motdText, setMotdText] = useState(motd?.message);
    const [motdType, setMotdType] = useState(motd?.motdType ?? 'info');

    const dispatch = useDispatch();

    return (
        <div className='mx-auto w-full max-w-5xl'>
            <Panel title='Motd administration'>
                <div className='max-w-4xl'>
                    <TextArea
                        rows={4}
                        value={motdText}
                        placeholder='Enter a motd message'
                        onChange={(event) => setMotdText(event.target.value)}
                    />
                </div>
                <div className='mt-3 flex flex-wrap gap-3'>
                    {motdTypes.map((type) => (
                        <Button
                            key={type.value}
                            type='button'
                            size='sm'
                            variant={motdType === type.value ? 'secondary' : 'light'}
                            onClick={() => setMotdType(type.value)}
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>

                <div className='mt-3 text-center'>
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={() =>
                            dispatch(
                                lobbySendMessage('motd', {
                                    message: motdText,
                                    motdType
                                })
                            )
                        }
                    >
                        Save
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

MotdAdmin.displayName = 'MotdAdmin';

export default MotdAdmin;
