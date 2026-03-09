import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Checkbox,
    Input,
    ListBox,
    Popover,
    Select,
    Spinner,
    Pagination,
    Table
} from '@heroui/react';
import {
    faArrowDownWideShort,
    faArrowUpShortWide,
    faFilter,
    faRefresh
} from '@fortawesome/free-solid-svg-icons';

import Icon from '../Icon';
import AlertPanel from '../Site/AlertPanel';

function getButtonVariant(color) {
    switch (color) {
        case 'danger':
        case 'red':
            return 'danger';
        case 'secondary':
            return 'secondary';
        case 'ghost':
        case 'light':
            return 'ghost';
        case 'outline':
            return 'outline';
        case 'tertiary':
            return 'tertiary';
        default:
            return 'primary';
    }
}

const normalizeSort = (sort) => {
    const firstSort = Array.isArray(sort) ? sort[0] : sort;
    if (firstSort?.column) {
        return {
            column: firstSort.column,
            direction: firstSort.direction
        };
    }

    if (!firstSort?.id) {
        return {};
    }

    return {
        column: firstSort.id,
        direction: firstSort.desc ? 'descending' : 'ascending'
    };
};

const toQuerySort = (sortDescriptor) =>
    sortDescriptor?.column
        ? [{ id: sortDescriptor.column, desc: sortDescriptor.direction === 'descending' }]
        : [];

const getRowId = (row, fallback = 0) => String(row?.id ?? row?.uuid ?? row?.key ?? fallback);

const toHeaderNode = (value, context = {}) =>
    typeof value === 'function' ? value(context) : value || '';

const toCellNode = (column, rowData) => {
    if (!column?.cell) {
        const fallback = rowData?.[column?.accessorKey];
        if (fallback !== undefined && fallback !== null) {
            return fallback;
        }

        return '';
    }

    if (typeof column.cell !== 'function') {
        return column.cell;
    }

    return column.cell({
        row: {
            original: rowData,
            index: rowData.__reactTableIndex || 0,
            id: rowData.__reactTableId || ''
        }
    });
};

const getColumnValue = (column, rowData) => {
    if (typeof column?.accessorFn === 'function') {
        return column.accessorFn(rowData);
    }

    if (column?.accessorKey) {
        return rowData?.[column.accessorKey];
    }

    return rowData?.[column?.id];
};

const compareSortValues = (left, right) => {
    if (left == null && right == null) {
        return 0;
    }

    if (left == null) {
        return -1;
    }

    if (right == null) {
        return 1;
    }

    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }

    return String(left).localeCompare(String(right), undefined, { sensitivity: 'base' });
};

const toLegacyRow = (value) => {
    const row = value?.__reactTableOriginal || value;

    return {
        original: row,
        index: row?.__reactTableIndex || 0,
        id: row?.__reactTableId || row?.id
    };
};

const getRowKey = (value) => {
    if (value && typeof value === 'object') {
        return String(value?.id || value?.key || value?.__reactTableId || value?.uuid || value);
    }

    return String(value);
};

const areSetEqual = (left = new Set(), right = new Set()) => {
    if (left === right) {
        return true;
    }

    if (left.size !== right.size) {
        return false;
    }

    for (const value of left) {
        if (!right.has(value)) {
            return false;
        }
    }

    return true;
};

const areSortDescriptorsEqual = (left = {}, right = {}) =>
    left?.column === right?.column && left?.direction === right?.direction;

const areObjectsEqual = (left = {}, right = {}) => {
    try {
        return JSON.stringify(left) === JSON.stringify(right);
    } catch {
        return false;
    }
};

function ReactTable({
    buttons = [],
    classNames,
    columns,
    data,
    dataLoadArg = null,
    dataLoadFn,
    dataProperty = 'data',
    defaultColumnFilters = {},
    defaultSort,
    disableSelection = false,
    emptyContent,
    isError: localIsError = false,
    isLoading: localIsLoading = false,
    isStriped = true,
    onPageChanged,
    onPageSizeChanged,
    onRefresh,
    onRowClick,
    onRowSelectionChange,
    pageSizeOptions = [10, 25, 50],
    remote = false,
    getRowClassName,
    selectedRows,
    startPageNumber = 0,
    startPageSize = 10,
    tableClassName = '',
    fillHeight = false
}) {
    const [pageSize, setPageSize] = useState(startPageSize);
    const [page, setPage] = useState(startPageNumber);
    const [columnFilters, setColumnFilters] = useState(defaultColumnFilters || {});
    const [internalSelectedKeys, setInternalSelectedKeys] = useState(new Set());
    const [sortDescriptor, setSortDescriptor] = useState(() => normalizeSort(defaultSort));
    const [filterOpen, setFilterOpen] = useState({});
    const isControlledSelection = selectedRows !== undefined;
    const selectedRowsSet = useMemo(() => {
        if (!selectedRows || selectedRows === 'all') {
            return new Set();
        }

        return new Set(selectedRows.map((key) => getRowKey(key)));
    }, [selectedRows]);
    const selectedKeys = isControlledSelection ? selectedRowsSet : internalSelectedKeys;
    const showSelection = !disableSelection;

    const normalizedColumns = useMemo(
        () =>
            (columns || []).map((column, index) => ({
                ...column,
                id: column.id || column.accessorKey || `column-${index}`,
                isRowHeader: column.isRowHeader ?? index === 0,
                __columnIndex: index
            })),
        [columns]
    );

    const columnById = useMemo(() => {
        return normalizedColumns.reduce((acc, column) => {
            acc[column.id] = column;
            return acc;
        }, {});
    }, [normalizedColumns]);

    useEffect(() => {
        const nextFilters = defaultColumnFilters || {};
        if (areObjectsEqual(columnFilters, nextFilters)) {
            return;
        }

        setColumnFilters(nextFilters);
    }, [columnFilters, defaultColumnFilters]);

    const queryArgs = useMemo(() => {
        const payload = {
            columnFilters: Object.entries(columnFilters).map(([id, value]) => ({ id, value })),
            pageIndex: page + 1,
            pageSize,
            sorting: toQuerySort(sortDescriptor)
        };

        return dataLoadArg ? { ...payload, ...dataLoadArg } : payload;
    }, [columnFilters, page, pageSize, sortDescriptor, dataLoadArg]);

    const queryResult = dataLoadFn ? dataLoadFn(queryArgs) : null;
    const response = queryResult?.data;

    const isLoading = remote ? queryResult?.isLoading : localIsLoading;
    const isError = remote ? queryResult?.isError : localIsError;
    const refetch = remote ? queryResult?.refetch || onRefresh : onRefresh;

    const remoteRows = remote ? response?.[dataProperty] || [] : [];
    const localRows = remote ? [] : data || [];
    const tableRows = remote ? remoteRows : localRows;

    const normalizedRows = useMemo(() => {
        const rows = (tableRows || [])
            .filter((row) => {
                if (remote) {
                    return true;
                }

                return Object.entries(columnFilters).every(([columnId, value]) => {
                    if (value === undefined || value === null || String(value).trim() === '') {
                        return true;
                    }

                    const column = columnById[columnId];
                    if (!column) {
                        return true;
                    }

                    const cellValue = getColumnValue(column, row);
                    if (cellValue === undefined || cellValue === null) {
                        return false;
                    }

                    const next = String(cellValue).toLowerCase();
                    return next.includes(String(value).toLowerCase());
                });
            })
            .map((row, index) => ({
                ...row,
                __reactTableId: getRowId(row, index),
                __reactTableIndex: index
            }));

        const sortedColumn = sortDescriptor?.column;
        if (!sortedColumn) {
            return rows;
        }

        const sortColumn = columnById[sortedColumn];
        if (!sortColumn) {
            return rows;
        }

        const direction = sortDescriptor?.direction === 'descending' ? -1 : 1;
        return [...rows].sort((left, right) => compareSortValues(
            getColumnValue(sortColumn, left),
            getColumnValue(sortColumn, right)
        ) * direction);
    }, [columnById, columnFilters, remote, sortDescriptor, tableRows]);

    const totalCount = remote ? response?.totalCount || 0 : normalizedRows.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = page * pageSize;
    const end = start + pageSize;
    const pageRows = useMemo(
        () => (remote ? normalizedRows : normalizedRows.slice(start, end)),
        [remote, normalizedRows, start, end]
    );
    const allRows = useMemo(
        () => new Map(normalizedRows.map((row) => [String(row.__reactTableId), row])),
        [normalizedRows]
    );
    const tableItems = pageRows;

    useEffect(() => {
        const maxPage = Math.max(0, pageCount - 1);
        if (page <= maxPage) {
            return;
        }

        setPage(maxPage);
    }, [page, pageCount]);

    const paginationItems = useMemo(() => {
        const current = page + 1;
        const siblingsPerSide = 1;
        const startWindow = Math.max(2, current - siblingsPerSide);
        const endWindow = Math.min(pageCount - 1, current + siblingsPerSide);
        const items = [];

        const addPage = (pageNumber) => {
            items.push({ type: 'page', value: pageNumber });
        };

        const addEllipsis = (key) => {
            items.push({ type: 'ellipsis', key });
        };

        addPage(1);

        if (startWindow > 2) {
            addEllipsis('start');
        }

        for (let value = startWindow; value <= endWindow; value += 1) {
            addPage(value);
        }

        if (endWindow < pageCount - 1) {
            addEllipsis('end');
        }

        if (pageCount > 1) {
            addPage(pageCount);
        }

        return items;
    }, [page, pageCount]);
    const pageSizeKey = String(pageSize);
    const headerCollectionKey = `${sortDescriptor?.column || 'none'}:${sortDescriptor?.direction || 'none'}:${Object.keys(columnFilters).sort().join(',')}`;
    const setFilter = (columnId, value) => {
        setPage(0);
        setColumnFilters((previous) => {
            const next = { ...previous };

            if (value === undefined || value === null || String(value).trim() === '') {
                delete next[columnId];
            } else {
                next[columnId] = value;
            }

            return next;
        });
    };

    const updatePage = (nextPage, triggerCallback = true) => {
        setPage((currentPage) => {
            const max = Math.max(0, pageCount - 1);
            const safePage = Math.min(Math.max(0, nextPage), max);
            if (safePage === currentPage) {
                return currentPage;
            }

            if (triggerCallback) {
                onPageChanged?.(safePage);
            }

            return safePage;
        });
    };

    const updatePageSize = (nextPageSize) => {
        setPage(0);
        setPageSize(nextPageSize);
        onPageSizeChanged?.(nextPageSize);
    };

    const topContent = useMemo(
        () => (
            <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-wrap gap-2'>
                    {buttons.map((button) => (
                        <Button
                            key={button.label}
                            className={button.className}
                            isDisabled={button.disabled}
                            isPending={button.isLoading}
                            onPress={button.onPress}
                            size={button.size || 'md'}
                            variant={button.variant || getButtonVariant(button.color)}
                        >
                            <span className='inline-flex items-center gap-2'>
                                {button.icon ? (
                                    <span className='inline-flex'>{button.icon}</span>
                                ) : null}
                                <span>{button.label}</span>
                            </span>
                        </Button>
                    ))}
                    {refetch ? (
                        <Button isIconOnly size='md' variant='tertiary' onPress={() => refetch()}>
                            <Icon icon={faRefresh} />
                        </Button>
                    ) : null}
                </div>
            </div>
        ),
        [buttons, refetch]
    );

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-6'>
                <Spinner size='sm' />
            </div>
        );
    }

    if (isError) {
        return <AlertPanel type='danger'>{'An error occurred loading data.'}</AlertPanel>;
    }

    const current = page + 1;

    return (
        <div
            className={`${fillHeight ? 'flex h-full min-h-0 flex-col' : ''} ${
                classNames?.base || ''
            }`}
        >
            {topContent}

            <Table
                aria-label='Data table'
                className={`${fillHeight ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : ''} rounded-lg border border-[color:var(--table-border)] bg-[var(--surface)] dark:border-zinc-700/60 dark:bg-black/35 ${tableClassName}`}
            >
                <Table.ScrollContainer className={fillHeight ? 'min-h-0 flex-1 overflow-auto' : ''}>
                    <Table.Content
                        aria-label='Data table'
                        selectedKeys={showSelection ? selectedKeys : undefined}
                        selectionMode={showSelection ? 'multiple' : 'none'}
                        selectionStyle={showSelection ? 'checkbox' : undefined}
                        sortDescriptor={sortDescriptor}
                        onSortChange={(nextSort) => {
                            const nextDescriptor = normalizeSort(nextSort);
                            if (areSortDescriptorsEqual(sortDescriptor, nextDescriptor)) {
                                return;
                            }

                            setSortDescriptor(nextDescriptor);
                            setPage(0);
                        }}
                        onSelectionChange={(nextKeys) => {
                            if (!showSelection) {
                                return;
                            }

                            const next = nextKeys === 'all'
                                ? new Set(pageRows.map((row) => row.__reactTableId))
                                : new Set(nextKeys || []);
                            const selectionChanged = !areSetEqual(selectedKeys, next);

                            if (!isControlledSelection) {
                                setInternalSelectedKeys((current) =>
                                    areSetEqual(current, next) ? current : next
                                );
                            }

                            if (!selectionChanged || !onRowSelectionChange) {
                                return;
                            }

                            const nextRows = Array.from(next)
                                .map((key) => allRows.get(String(key)))
                                .filter(Boolean)
                                .map(toLegacyRow);

                            onRowSelectionChange(nextRows);
                        }}
                    >
                        <Table.Header>
                            {showSelection ? (
                                <Table.Column
                                    key='selection'
                                    className='w-12 text-center'
                                    isRowHeader={false}
                                >
                                    <Checkbox aria-label='Select all rows' slot='selection'>
                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>
                                    </Checkbox>
                                </Table.Column>
                            ) : null}
                            <Table.Collection key={headerCollectionKey} items={normalizedColumns}>
                                {(column) => {
                                const headerClassName = column.meta?.className || '';
                                const isCenterAligned = headerClassName.includes('text-center');
                                const isRightAligned = headerClassName.includes('text-right');
                                const columnId = column.id;
                                const isDataColumn = Boolean(column.accessorKey || column.accessorFn);
                                const isGroupingFilter = Boolean(column.meta?.groupingFilter);
                                const canFilter =
                                    Boolean(column.enableColumnFilter) !== false &&
                                    (isDataColumn || isGroupingFilter) &&
                                    column.meta?.hideFilter !== true;
                                const canSort =
                                    column.meta?.sortable !== false &&
                                    isDataColumn;
                                const isSortedColumn = sortDescriptor?.column === columnId;
                                const sortIcon = !isSortedColumn
                                    ? null
                                    : sortDescriptor.direction === 'descending'
                                        ? faArrowDownWideShort
                                        : faArrowUpShortWide;

                                return (
                                    <Table.Column
                                        key={columnId}
                                        allowsSorting={canSort}
                                        className={headerClassName}
                                        isRowHeader={column.isRowHeader}
                                        style={{
                                            width: column.meta?.colWidth,
                                            textAlign: isRightAligned ? 'right' : isCenterAligned ? 'center' : 'left'
                                        }}
                                    >
                                        <div className='flex items-center gap-1'>
                                            <span className='truncate'>{toHeaderNode(column.header, { column })}</span>
                                            {canSort ? (
                                                <span
                                                    aria-hidden='true'
                                                    className={`inline-flex text-xs ${
                                                        isSortedColumn
                                                            ? 'text-[color:var(--brand)]'
                                                            : 'text-foreground/40'
                                                    }`}
                                                >
                                                    {sortIcon ? <Icon icon={sortIcon} /> : ' '}
                                                </span>
                                            ) : null}
                                            {canFilter ? (
                                                <Popover
                                                    isOpen={filterOpen[columnId]}
                                                    onOpenChange={(open) => {
                                                        setFilterOpen((previous) => ({
                                                            ...previous,
                                                            [columnId]: open
                                                        }));
                                                    }}
                                                >
                                                    <Popover.Trigger>
                                                        <button
                                                            type='button'
                                                            className={`rounded px-1 py-0.5 text-xs ${
                                                                columnFilters[columnId]
                                                                    ? 'text-[color:var(--brand)]'
                                                                    : 'text-foreground/70 dark:text-zinc-300'
                                                            }`}
                                                        >
                                                            <Icon icon={faFilter} />
                                                        </button>
                                                    </Popover.Trigger>
                                                    <Popover.Content offset={12}>
                                                        <Popover.Dialog>
                                                            {isGroupingFilter ? (
                                                                column.meta.groupingFilter(
                                                                    () => {
                                                                        setFilterOpen((previous) => ({
                                                                            ...previous,
                                                                            [columnId]:
                                                                                !previous[columnId]
                                                                        }));
                                                                    },
                                                                    column,
                                                                    allRows
                                                                )
                                                            ) : (
                                                                <Input
                                                                    autoFocus
                                                                    className='select-text min-w-[13rem]'
                                                                    placeholder='Filter'
                                                                    size='sm'
                                                                    variant='tertiary'
                                                                    value={columnFilters[columnId] || ''}
                                                                    onPointerDown={(event) => {
                                                                        event.stopPropagation();
                                                                    }}
                                                                    onChange={(event) => {
                                                                        setFilter(columnId, event.target.value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Popover.Dialog>
                                                    </Popover.Content>
                                                </Popover>
                                            ) : null}
                                        </div>
                                    </Table.Column>
                                );
                                }}
                            </Table.Collection>
                        </Table.Header>
                        <Table.Body
                            items={tableItems}
                            renderEmptyState={() =>
                                emptyContent || (
                                    <AlertPanel type='info'>{'There is no data to display'}</AlertPanel>
                                )
                            }
                        >
                            {(item) => {
                                const rowData = item;
                                return (
                                    <Table.Row
                                        id={item.__reactTableId}
                                        key={item.__reactTableId}
                                        className={`${
                                        getRowClassName ? getRowClassName(toLegacyRow(rowData)) : ''
                                    }`}
                                    >
                                        {showSelection ? (
                                            <Table.Cell className='w-12 text-center'>
                                                <Checkbox
                                                    aria-label={`Select row ${item.__reactTableId}`}
                                                    slot='selection'
                                                >
                                                    <Checkbox.Control>
                                                        <Checkbox.Indicator />
                                                    </Checkbox.Control>
                                                </Checkbox>
                                            </Table.Cell>
                                        ) : null}
                                        <Table.Collection items={normalizedColumns}>
                                            {(column) => (
                                                <Table.Cell
                                                    className={column.meta?.className || ''}
                                                    key={column.id}
                                                    onClick={() => onRowClick?.(toLegacyRow(rowData))}
                                                >
                                                    {toCellNode(column, rowData)}
                                                </Table.Cell>
                                            )}
                                        </Table.Collection>
                                    </Table.Row>
                                );
                            }}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
                </Table>

                <div className='mt-2 flex shrink-0 items-center gap-2'>
                <div className='min-w-0 flex-1 overflow-x-auto'>
                <Pagination size='sm' className='inline-flex min-w-max flex-none text-sm'>
                    <Pagination.Content className='gap-1'>
                        <Pagination.Item>
                            <Pagination.Previous
                                isDisabled={current <= 1}
                                onPress={() => updatePage(Math.max(0, current - 2))}
                            >
                                <Pagination.PreviousIcon />
                            </Pagination.Previous>
                        </Pagination.Item>
                        {paginationItems.map((item) => (
                            item.type === 'ellipsis' ? (
                                <Pagination.Ellipsis key={item.key} />
                            ) : (
                                <Pagination.Item key={`page-${item.value}`}>
                                    <Pagination.Link
                                        isActive={item.value === current}
                                        onPress={() => updatePage(item.value - 1, false)}
                                    >
                                        {item.value}
                                    </Pagination.Link>
                                </Pagination.Item>
                            )
                        ))}
                        <Pagination.Item>
                            <Pagination.Next
                                isDisabled={current >= pageCount}
                                onPress={() => updatePage(Math.min(pageCount - 1, current))}
                            >
                                <Pagination.NextIcon />
                            </Pagination.Next>
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination>
                </div>
                <div className='flex flex-none items-center gap-2 whitespace-nowrap'>
                    <Select
                        aria-label='Page size'
                        className='w-24'
                        selectedKey={pageSizeKey}
                        onSelectionChange={(key) => {
                            const next = String(key || pageSizeKey);
                            const nextPageSize = parseInt(next, 10);
                            if (Number.isNaN(nextPageSize) || nextPageSize === pageSize) {
                                return;
                            }

                            updatePageSize(nextPageSize);
                        }}
                    >
                        <Select.Trigger>
                            <Select.Value>{pageSizeKey}</Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {pageSizeOptions.map((pageOption) => (
                                    <ListBox.Item
                                        key={pageOption.toString()}
                                        id={pageOption.toString()}
                                        textValue={pageOption.toString()}
                                    >
                                        {pageOption.toString()}
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                    <span className='text-sm text-muted'>
                        Page {current} of {pageCount} ({totalCount} items)
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ReactTable;
