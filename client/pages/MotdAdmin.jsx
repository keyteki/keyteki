import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
        <div className='mx-auto w-full max-w-[960px]'>
            <Panel title='Motd administration'>
                <div className='max-w-[860px]'>
                    <textarea
                        rows={4}
                        value={motdText}
                        placeholder='Enter a motd message'
                        onChange={(event) => setMotdText(event.target.value)}
                        className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                    />
                </div>
                <div className='mt-3 flex flex-wrap gap-3'>
                    {motdTypes.map((type) => (
                        <label
                            key={type.value}
                            className='flex items-center gap-2 text-sm text-zinc-200'
                        >
                            <input
                                name='motdType'
                                type='radio'
                                value={type.value}
                                checked={motdType === type.value}
                                onChange={() => setMotdType(type.value)}
                                className='h-4 w-4 border-zinc-500 bg-zinc-900/80 accent-red-600'
                            />
                            <span>{type.label}</span>
                        </label>
                    ))}
                </div>

                <div className='mt-3 text-center'>
                    <button
                        className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                        type='button'
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
                    </button>
                </div>
            </Panel>
        </div>
    );
};

MotdAdmin.displayName = 'MotdAdmin';

export default MotdAdmin;
