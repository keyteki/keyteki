import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Label, Switch } from '@heroui/react';
import { Constants } from '../../constants';

const GameFormats = ({
    formProps,
    showAllowedSets = true,
    showGameMode = true,
    allowedSetsSecondary = false
}) => {
    const { t } = useTranslation();

    const formats = [
        { name: 'archon', label: t('Archon') },
        { name: 'alliance', label: t('Alliance') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') },
        { name: 'reversal', label: t('Reversal') },
        { name: 'unchained', label: t('Unchained') }
    ];

    const expansions = Constants.Expansions.filter((e) => e.name !== 'uc2022');
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
                        <Trans>Game format</Trans>
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
                                <div className='rounded-md border border-border/20 bg-surface-secondary/78 px-3 py-2 text-sm text-foreground/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors hover:bg-surface-secondary/92 peer-checked:border-accent/55 peer-checked:bg-[color:color-mix(in_oklab,var(--surface-secondary)_82%,var(--brand)_18%)] peer-checked:text-foreground'>
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

            {showAllowedSets && formProps.values.gameFormat !== 'unchained' && (
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
                    {formProps.errors.allowedSets ? (
                        <div className='mt-0.5 mb-1 text-xs text-red-300'>
                            {formProps.errors.allowedSets}
                        </div>
                    ) : null}
                    <div className='mb-1.5 flex items-center justify-between gap-3'>
                        <div className='flex items-center gap-2'>
                            <Button
                                className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand)]'
                                size='sm'
                                variant='ghost'
                                onPress={() => setAllExpansions(true)}
                            >
                                <Trans>Select all</Trans>
                            </Button>
                            <Button
                                className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand)]'
                                size='sm'
                                variant='ghost'
                                onPress={() => {
                                    setAllExpansions(false);
                                    for (const name of ['cota', 'aoa', 'wc', 'mm', 'dt']) {
                                        formProps.setFieldValue(name, true);
                                    }
                                }}
                            >
                                <Trans>FFG Sets</Trans>
                            </Button>
                            <Button
                                className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand)]'
                                size='sm'
                                variant='ghost'
                                onPress={() => {
                                    setAllExpansions(false);
                                    for (const name of [
                                        'momu',
                                        'woe',
                                        'gr',
                                        'as',
                                        'toc',
                                        'pv',
                                        'cc',
                                        'dm',
                                        'disc',
                                        'vm2023',
                                        'vm2024',
                                        'vm2025',
                                        'vm2026'
                                    ]) {
                                        formProps.setFieldValue(name, true);
                                    }
                                }}
                            >
                                <Trans>GG Sets</Trans>
                            </Button>
                            <Button
                                className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand)]'
                                size='sm'
                                variant='ghost'
                                onPress={() => setAllExpansions(false)}
                            >
                                <Trans>Clear all</Trans>
                            </Button>
                        </div>
                    </div>
                    <div className='columns-1 gap-x-2 space-y-1.5 sm:columns-2 lg:columns-4'>
                        {expansions.map((expansion) => (
                            <div
                                key={expansion.name}
                                className='break-inside-avoid flex items-center justify-between gap-2 rounded-md bg-surface-secondary/70 px-3 py-0.5'
                            >
                                <span className='flex items-center gap-1.5'>
                                    <img
                                        src={Constants.DeckIconPaths[expansion.value]}
                                        alt=''
                                        className='h-5 w-5 object-contain'
                                    />
                                    <Label className='text-sm text-foreground'>
                                        {t(expansion.fullName)}
                                    </Label>
                                </span>
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
