import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Input, Switch, toast } from '@heroui/react';

const GameOptions = ({ formProps, gameLink }) => {
    const { t } = useTranslation();
    const sectionHeaderClass = 'mb-2 mt-1 text-sm font-semibold tracking-wide text-foreground';
    const sectionBlockClass =
        'flex-1 rounded-md border border-[color:color-mix(in_oklab,var(--border)_72%,transparent)] bg-[color:var(--section)] px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]';

    const renderToggle = (name, label) => (
        <Switch
            id={name}
            name={name}
            isSelected={!!formProps.values[name]}
            onChange={(isSelected) => formProps.setFieldValue(name, isSelected)}
            className='flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 px-1'
            key={name}
        >
            <span className='text-sm text-foreground'>{label}</span>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch>
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

    const nestedInputClass =
        'mt-2 w-full space-y-1 rounded-md border border-[color:color-mix(in_oklab,var(--border)_68%,transparent)] bg-[color:var(--control)] p-2.5';

    return (
        <div className='configGrid grid grid-cols-1 items-start gap-4 lg:[grid-template-columns:repeat(2,minmax(0,1fr))]'>
            <div className='flex h-full flex-col'>
                <div className={sectionHeaderClass}>
                    <Trans>Visibility</Trans>
                </div>
                <div className={sectionBlockClass}>
                    <Switch
                        id='gamePrivate'
                        name='gamePrivate'
                        isSelected={!!formProps.values.gamePrivate}
                        onChange={(isSelected) =>
                            formProps.setFieldValue('gamePrivate', isSelected)
                        }
                        className='flex w-full cursor-pointer items-center justify-between gap-3'
                    >
                        <div className='flex flex-col'>
                            <span className='text-sm text-foreground'>
                                {t('Unlisted (link only)')}
                            </span>
                            <span className='text-xs text-foreground/78'>
                                {t("Won't appear in Current Games.")}
                            </span>
                        </div>
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch>
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

            <div className='flex h-full flex-col'>
                <div className={sectionHeaderClass}>
                    <Trans>Time</Trans>
                </div>
                <div className={sectionBlockClass}>
                    {renderToggle('useGameTimeLimit', t('Use a time limit (in minutes)'))}
                    {formProps.values.useGameTimeLimit && (
                        <div className={nestedInputClass}>
                            <label
                                className='block text-xs font-medium text-foreground/78'
                                htmlFor='gameTimeLimit'
                            >
                                {t('Time Limit')}
                            </label>
                            <Input
                                className='w-full'
                                id='gameTimeLimit'
                                name='gameTimeLimit'
                                type='text'
                                placeholder={t('Enter time limit')}
                                value={formProps.values.gameTimeLimit}
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                            />
                            {formProps.touched.gameTimeLimit && formProps.errors.gameTimeLimit ? (
                                <div className='text-xs text-red-300'>
                                    {formProps.errors.gameTimeLimit}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            <div className='flex h-full flex-col'>
                <div className={sectionHeaderClass}>
                    <Trans>Spectators</Trans>
                </div>
                <div className={sectionBlockClass}>
                    <div className='divide-y divide-[color:color-mix(in_oklab,var(--border)_58%,transparent)]'>
                        {renderToggle('allowSpectators', t('Allow spectators'))}
                        {renderToggle('showHand', t('Show hands to spectators'))}
                        {renderToggle('muteSpectators', t('Mute spectators'))}
                    </div>
                </div>
            </div>

            <div className='flex h-full flex-col'>
                <div className={sectionHeaderClass}>
                    <Trans>Access</Trans>
                </div>
                <div className={sectionBlockClass}>
                    <div className='divide-y divide-[color:color-mix(in_oklab,var(--border)_58%,transparent)]'>
                        {renderToggle('hideDeckLists', t('Hide deck lists'))}
                        <div className='pt-1'>
                            {renderToggle('requirePassword', t('Require password'))}
                        </div>
                    </div>
                    {formProps.values.requirePassword && (
                        <div className={nestedInputClass}>
                            <label
                                className='block text-xs font-medium text-foreground/78'
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
                                autoComplete='off'
                                data-1p-ignore='true'
                                data-lpignore='true'
                                data-bwignore='true'
                                data-form-type='other'
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameOptions;
