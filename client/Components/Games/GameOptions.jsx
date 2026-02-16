import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Input, Label, Switch, toast } from '@heroui/react';

const GameOptions = ({ formProps, gameLink }) => {
    const { t } = useTranslation();
    const renderToggle = (name, label) => (
        <div className='flex items-center justify-between gap-3 px-1 py-1' key={name}>
            <Label className='text-sm text-foreground'>{label}</Label>
            <Switch
                id={name}
                name={name}
                isSelected={!!formProps.values[name]}
                onChange={(isSelected) => formProps.setFieldValue(name, isSelected)}
            >
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch>
        </div>
    );

    const handleCopyLink = async () => {
        try {
            if (!navigator.clipboard?.writeText) {
                throw new Error('Clipboard unavailable');
            }

            await navigator.clipboard.writeText(gameLink);
            toast.success(t('Game link copied'));
        } catch (error) {
            toast.danger(t('Unable to copy game link'));
        }
    };

    return (
        <div>
            <div className='mb-2 text-sm font-semibold text-zinc-100'>
                <Trans>Options</Trans>
            </div>
            <div className='space-y-3'>
                <div>
                    <div className='mb-1 text-xs font-medium tracking-wide text-zinc-400'>
                        <Trans>Visibility</Trans>
                    </div>
                    <div className='rounded-md bg-surface-secondary/25 px-2 py-1'>
                        <div className='space-y-1 px-1 py-1'>
                            <div className='flex items-center justify-between gap-3'>
                                <Label className='text-sm text-foreground'>
                                    {t('Unlisted (link only)')}
                                </Label>
                                <Switch
                                    id='gamePrivate'
                                    name='gamePrivate'
                                    isSelected={!!formProps.values.gamePrivate}
                                    onChange={(isSelected) =>
                                        formProps.setFieldValue('gamePrivate', isSelected)
                                    }
                                >
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch>
                            </div>
                            <p className='text-xs text-zinc-400'>
                                {t("Won't appear in Current Games.")}
                            </p>
                            {formProps.values.gamePrivate && gameLink && (
                                <div>
                                    <Button
                                        className='h-auto min-h-0 px-0 text-xs'
                                        onPress={handleCopyLink}
                                        size='sm'
                                        variant='light'
                                    >
                                        <Trans>Copy link</Trans>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div className='mb-1 text-xs font-medium tracking-wide text-zinc-400'>
                        <Trans>Spectators</Trans>
                    </div>
                    <div className='rounded-md bg-surface-secondary/25 px-2 py-1'>
                        <div className='divide-y divide-white/5'>
                            {renderToggle('allowSpectators', t('Allow spectators'))}
                            {renderToggle('showHand', t('Show hands to spectators'))}
                            {renderToggle('muteSpectators', t('Mute spectators'))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className='mb-1 text-xs font-medium tracking-wide text-zinc-400'>
                        <Trans>Time</Trans>
                    </div>
                    <div className='rounded-md bg-surface-secondary/25 px-2 py-1'>
                        <div className='space-y-0.5'>
                            {renderToggle('useGameTimeLimit', t('Use a time limit (in minutes)'))}
                            {formProps.values.useGameTimeLimit && (
                                <div className='ml-5 max-w-[260px] space-y-1 rounded-md border border-white/10 bg-surface-secondary/30 p-2'>
                                    <label
                                        className='block text-xs font-medium text-zinc-300'
                                        htmlFor='gameTimeLimit'
                                    >
                                        {t('Time Limit')}
                                    </label>
                                    <Input
                                        id='gameTimeLimit'
                                        name='gameTimeLimit'
                                        type='text'
                                        placeholder={t('Enter time limit')}
                                        value={formProps.values.gameTimeLimit}
                                        onBlur={formProps.handleBlur}
                                        onChange={formProps.handleChange}
                                    />
                                    {formProps.touched.gameTimeLimit &&
                                    formProps.errors.gameTimeLimit ? (
                                        <div className='text-xs text-red-300'>
                                            {formProps.errors.gameTimeLimit}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div className='mb-1 text-xs font-medium tracking-wide text-zinc-400'>
                        <Trans>Deck info</Trans>
                    </div>
                    <div className='rounded-md bg-surface-secondary/25 px-2 py-1'>
                        <div className='divide-y divide-white/5'>
                            {renderToggle('hideDeckLists', t('Hide deck lists'))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className='mb-1 text-xs font-medium tracking-wide text-zinc-400'>
                        <Trans>Access</Trans>
                    </div>
                    <div className='rounded-md bg-surface-secondary/25 px-2 py-1'>
                        <div className='space-y-0.5'>
                            {renderToggle('requirePassword', t('Require password'))}
                            {formProps.values.requirePassword && (
                                <div className='ml-5 max-w-xl space-y-1 rounded-md border border-white/10 bg-surface-secondary/30 p-2'>
                                    <label
                                        className='block text-xs font-medium text-zinc-300'
                                        htmlFor='password'
                                    >
                                        {t('Password')}
                                    </label>
                                    <Input
                                        className='w-full'
                                        id='password'
                                        name='password'
                                        type='password'
                                        placeholder={t('Enter a password')}
                                        value={formProps.values.password}
                                        onBlur={formProps.handleBlur}
                                        onChange={formProps.handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameOptions;
