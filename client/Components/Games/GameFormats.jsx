import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Label, Switch } from '@heroui/react';

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
                    <div className='mb-1 text-sm font-semibold text-foreground'>
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
                                <div className='rounded-md border border-border/20 bg-surface-secondary/78 px-3 py-2 text-sm text-foreground/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors hover:bg-surface-secondary/92 peer-checked:border-accent/55 peer-checked:bg-[color:color-mix(in_oklab,var(--surface-secondary)_82%,var(--brand-red)_18%)] peer-checked:text-foreground'>
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
                                ? 'text-xs font-medium text-foreground/75'
                                : 'text-sm font-semibold text-foreground'
                        }`}
                    >
                        <Trans>Allowed sets</Trans>
                    </div>
                    <div className='mb-1.5 flex items-center justify-between gap-3'>
                        <p className='text-xs leading-tight text-foreground/80'>
                            <Trans>Select which sets can be used for sealed decks.</Trans>
                        </p>
                        <div className='flex items-center gap-2'>
                            <Button
                                className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand-red)]'
                                size='sm'
                                variant='ghost'
                                onPress={() => setAllExpansions(true)}
                            >
                                <Trans>Select all</Trans>
                            </Button>
                            <Button
                                className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand-red)]'
                                size='sm'
                                variant='ghost'
                                onPress={() => setAllExpansions(false)}
                            >
                                <Trans>Clear all</Trans>
                            </Button>
                        </div>
                    </div>
                    <div className='grid gap-x-2 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-4'>
                        {expansions.map((expansion) => (
                            <div
                                key={expansion.name}
                                className='flex items-center justify-between gap-2 rounded-md bg-surface-secondary/70 px-3 py-0.5'
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
