import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextArea, toast } from '@heroui/react';

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
    const [isSaving, setIsSaving] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isSaving || !pendingPayload || !motd) {
            return;
        }

        if (
            motd.message === pendingPayload.message &&
            (motd.motdType ?? 'info') === pendingPayload.motdType
        ) {
            setIsSaving(false);
            setPendingPayload(null);
            toast.success('MOTD saved.');
        }
    }, [isSaving, motd, pendingPayload]);

    useEffect(() => {
        if (!isSaving) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsSaving(false);
            setPendingPayload(null);
            toast.danger('Could not confirm MOTD save. Please try again.');
        }, 8000);

        return () => clearTimeout(timeoutId);
    }, [isSaving]);

    return (
        <div className='mx-auto w-full max-w-5xl'>
            <Panel title='Motd administration'>
                <div className='w-full'>
                    <TextArea
                        className='w-full'
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
                        variant='primary'
                        isPending={isSaving}
                        onClick={() => {
                            const payload = {
                                message: motdText,
                                motdType
                            };
                            setIsSaving(true);
                            setPendingPayload(payload);
                            toast.success('Saving MOTD...');
                            dispatch(lobbySendMessage('motd', payload));
                        }}
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
