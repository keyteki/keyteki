import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Input, Popover } from '@heroui/react';
import Icon from '../Icon';
import { faChevronDown, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons';

const DeckSetFilter = ({ expansions = [], selectedExpansions = [], onChange, label, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const triggerRef = useRef(null);
    const searchRef = useRef(null);
    const panelId = 'deck-set-filter-popover';

    const filteredExpansions = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return expansions;
        }

        return expansions.filter((expansion) =>
            String(expansion.label || expansion.name || expansion.value)
                .toLowerCase()
                .includes(query)
        );
    }, [expansions, search]);

    const isSetSelected = useCallback(
        (value) => selectedExpansions.some((expansion) => expansion.value === value),
        [selectedExpansions]
    );

    const toggleSet = useCallback(
        (expansion, isSelected) => {
            const exists = selectedExpansions.some((entry) => entry.value === expansion.value);
            const shouldAdd = isSelected ?? !exists;
            const nextValues = shouldAdd
                ? exists
                    ? selectedExpansions
                    : [...selectedExpansions, expansion]
                : selectedExpansions.filter((entry) => entry.value !== expansion.value);

            onChange(nextValues);
        },
        [onChange, selectedExpansions]
    );

    const selectAllSets = useCallback(() => {
        onChange(expansions);
    }, [expansions, onChange]);

    const clearAllSets = useCallback(() => {
        onChange([]);
    }, [onChange]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        requestAnimationFrame(() => {
            searchRef.current?.focus();
        });
    }, [isOpen]);

    return (
        <div>
            <label className='mb-1 block text-sm text-foreground'>{label}</label>
            <Popover
                id={panelId}
                isOpen={isOpen}
                placement='bottom'
                shouldFlip
                onOpenChange={setIsOpen}
            >
                <Popover.Trigger>
                    <Button
                        ref={triggerRef}
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        className='w-full justify-between'
                        variant='tertiary'
                    >
                        <span className='truncate text-left'>
                            {selectedExpansions.length > 0
                                ? `${t('Sets')}: ${selectedExpansions.length} ${t('selected')}`
                                : t('All sets')}
                        </span>
                        <Icon className='text-muted' icon={isOpen ? faChevronUp : faChevronDown} />
                    </Button>
                </Popover.Trigger>
                <Popover.Content className='w-[min(520px,calc(100vw-3rem))] max-w-full rounded-md border border-[color:var(--table-border)] !bg-[var(--surface)] p-2 !text-foreground shadow-[var(--overlay-shadow)] dark:border-white/10 dark:!bg-zinc-900/95 dark:!text-zinc-100'>
                    <Popover.Dialog>
                        <div className='mb-2 flex items-center gap-2'>
                            <Input
                                ref={searchRef}
                                aria-label={t('Search sets')}
                                className='flex-1'
                                placeholder={t('Search sets')}
                                size='sm'
                                value={search}
                                variant='tertiary'
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            <Button
                                aria-label={t('Close')}
                                isIconOnly
                                size='sm'
                                variant='ghost'
                                onPress={() => setIsOpen(false)}
                            >
                                <Icon icon={faXmark} />
                            </Button>
                        </div>

                        <div className='max-h-56 space-y-1 overflow-y-auto pr-1'>
                            {filteredExpansions.map((expansion) => {
                                const expansionLabel =
                                    expansion.label || expansion.name || expansion.value;
                                const checked = isSetSelected(expansion.value);

                                return (
                                    <Checkbox
                                        key={expansion.value}
                                        className={`w-full rounded px-2 py-1.5 text-sm transition [&_[data-slot=label]]:!text-foreground [&_[data-slot=label]]:!opacity-100 [&_[data-slot=wrapper]]:!opacity-100 ${
                                            checked
                                                ? 'bg-[var(--table-selected-bg)] !text-foreground dark:bg-[var(--table-selected-bg)] dark:!text-zinc-100 dark:[&_[data-slot=label]]:!text-zinc-100'
                                                : '!text-foreground hover:bg-[var(--table-row-hover)] dark:text-zinc-300 dark:hover:bg-zinc-800/70'
                                        }`}
                                        isSelected={checked}
                                        variant='tertiary'
                                        onChange={(isSelected) => toggleSet(expansion, isSelected)}
                                    >
                                        <span className='text-foreground dark:text-zinc-100'>
                                            {expansionLabel}
                                        </span>
                                    </Checkbox>
                                );
                            })}
                        </div>

                        <div className='mt-2 border-t border-[color:var(--table-border)] pt-2 dark:border-white/10'>
                            <div className='mt-2 flex items-center justify-between gap-2'>
                                <Button
                                    className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand)]'
                                    size='sm'
                                    variant='ghost'
                                    onPress={selectAllSets}
                                >
                                    {t('Select all')}
                                </Button>
                                <Button
                                    className='h-auto min-h-0 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-[var(--table-row-hover)] hover:text-[color:var(--brand)]'
                                    size='sm'
                                    variant='ghost'
                                    onPress={clearAllSets}
                                >
                                    {t('Clear all')}
                                </Button>
                            </div>
                        </div>
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        </div>
    );
};

export default DeckSetFilter;
