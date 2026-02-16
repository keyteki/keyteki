import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Label, Switch } from '@heroui/react';

const GameFormats = ({
    formProps,
    showAllowedSets = true,
    showGameMode = true,
    allowedSetsSecondary = false
}) => {
    const { t } = useTranslation();

    const formats = [
        { name: 'normal', label: t('Normal') },
        { name: 'unchained', label: t('Unchained') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'reversal', label: t('Reversal') },
        { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') },
        { name: 'alliance', label: t('Alliance') }
    ];

    const expansions = [
        { name: 'cota', label: t('Call of the Archons') },
        { name: 'aoa', label: t('Age of Ascension') },
        { name: 'wc', label: t('Worlds Collide') },
        { name: 'mm', label: t('Mass Mutation') },
        { name: 'dt', label: t('Dark Tidings') },
        { name: 'woe', label: t('Winds of Exchange') },
        { name: 'gr', label: t('Grim Reminders') },
        { name: 'as', label: t('Aember Skies') },
        { name: 'toc', label: t('Tokens of Change') },
        { name: 'momu', label: t('More Mutation') },
        { name: 'disc', label: t('Discovery') },
        { name: 'vm2023', label: t('Vault Masters 2023') },
        { name: 'vm2024', label: t('Vault Masters 2024') },
        { name: 'vm2025', label: t('Vault Masters 2025') },
        { name: 'pv', label: t('Prophetic Visions') },
        { name: 'cc', label: t('Crucible Clash') }
    ];
    const expansionNames = expansions.map((expansion) => expansion.name);

    const setAllExpansions = (nextValue) => {
        for (const expansionName of expansionNames) {
            formProps.setFieldValue(expansionName, nextValue);
        }
    };

    return (
        <div className='space-y-3'>
            {showGameMode && (
                <div>
                    <div className='mb-1 text-sm font-semibold text-zinc-100'>
                        <Trans>Game mode</Trans>
                    </div>
                    <div className='grid gap-x-3.5 gap-y-1 sm:grid-cols-2 lg:grid-cols-3'>
                        {formats.map((format) => (
                            <label className='block cursor-pointer' key={format.name}>
                                <input
                                    checked={formProps.values.gameFormat === format.name}
                                    className='peer sr-only'
                                    name='gameFormat'
                                    onChange={() =>
                                        formProps.setFieldValue('gameFormat', format.name)
                                    }
                                    type='radio'
                                    value={format.name}
                                />
                                <div className='rounded-md border border-white/10 bg-surface-secondary/35 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-surface-secondary/55 peer-checked:border-accent/70 peer-checked:bg-accent/4 peer-checked:text-zinc-100'>
                                    {format.label}
                                </div>
                            </label>
                        ))}
                    </div>
                    {formProps.errors.gameFormat ? (
                        <div className='mt-1 text-xs text-red-300'>
                            {formProps.errors.gameFormat}
                        </div>
                    ) : null}
                </div>
            )}

            {showAllowedSets && formProps.values.gameFormat === 'sealed' && (
                <div>
                    <div
                        className={`mb-0.5 ${
                            allowedSetsSecondary
                                ? 'text-xs font-medium text-zinc-400'
                                : 'text-sm font-semibold text-zinc-100'
                        }`}
                    >
                        <Trans>Allowed sets</Trans>
                    </div>
                    <div className='mb-1.5 flex items-center justify-between gap-3'>
                        <p className='text-xs leading-tight text-zinc-500'>
                            <Trans>Select which sets can be used for sealed decks.</Trans>
                        </p>
                        <div className='flex items-center gap-3'>
                            <button
                                className='text-xs text-zinc-400 transition-colors hover:text-zinc-200'
                                onClick={() => setAllExpansions(true)}
                                type='button'
                            >
                                <Trans>Select all</Trans>
                            </button>
                            <button
                                className='text-xs text-zinc-400 transition-colors hover:text-zinc-200'
                                onClick={() => setAllExpansions(false)}
                                type='button'
                            >
                                <Trans>Clear all</Trans>
                            </button>
                        </div>
                    </div>
                    <div className='grid gap-x-2 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-4'>
                        {expansions.map((expansion) => (
                            <div
                                key={expansion.name}
                                className='flex items-center justify-between gap-2 rounded-md border border-white/10 bg-surface-secondary/35 px-3 py-0.5'
                            >
                                <Label className='text-sm text-foreground'>{expansion.label}</Label>
                                <Switch
                                    id={expansion.name}
                                    name={expansion.name}
                                    isSelected={!!formProps.values[expansion.name]}
                                    onChange={(isSelected) =>
                                        formProps.setFieldValue(expansion.name, isSelected)
                                    }
                                >
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameFormats;
