import React, { useState } from 'react';
import Button from '../Components/HeroUI/Button';
import { Textarea, Radio, RadioGroup } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSetMotd } from '../redux/slices/lobbySlice';

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
        <div className='max-w-4xl mx-auto'>
            <Panel title='Motd administration'>
                <div className='space-y-4'>
                    <Textarea
                        label='MOTD Message'
                        placeholder='Enter a motd message'
                        value={motdText}
                        onValueChange={setMotdText}
                        minRows={4}
                    />

                    <RadioGroup
                        label='Message Type'
                        orientation='horizontal'
                        value={motdType}
                        onValueChange={setMotdType}
                    >
                        {motdTypes.map((type) => (
                            <Radio key={type.value} value={type.value}>
                                {type.label}
                            </Radio>
                        ))}
                    </RadioGroup>

                    <div className='text-center'>
                        <Button
                            color='primary'
                            onPress={() =>
                                dispatch(
                                    sendSetMotd({
                                        message: motdText,
                                        motdType: motdType
                                    })
                                )
                            }
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

MotdAdmin.displayName = 'MotdAdmin';

export default MotdAdmin;
