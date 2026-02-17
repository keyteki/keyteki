import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { Button, Input, ListBox, Popover, Select, Spinner } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowDownLong,
    faArrowUpLong,
    faFilter,
    faRefresh
} from '@fortawesome/free-solid-svg-icons';

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
    fillHeight = false,
    maxVisibleRows: maxVisibleRowsProp = null
}) {
    const tableRef = useRef(null);
    const [maxHeightPx, setMaxHeightPx] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: startPageNumber,
        pageSize: startPageSize
    });
    const [sorting, setSorting] = useState(defaultSort || []);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [isFilterPopOverOpen, setFilterPopOverOpen] = useState({});

    useEffect(() => {
        if (!selectedRows || selectedRows === 'all') {
            setRowSelection((currentSelection) =>
                Object.keys(currentSelection).length === 0 ? currentSelection : {}
            );
            return;
        }

        const nextSelection = [...selectedRows].reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});

        setRowSelection((currentSelection) => {
            const currentKeys = Object.keys(currentSelection).sort();
            const nextKeys = Object.keys(nextSelection).sort();

            if (
                currentKeys.length === nextKeys.length &&
                currentKeys.every((key, index) => key === nextKeys[index])
            ) {
                return currentSelection;
            }

            return nextSelection;
        });
    }, [selectedRows]);

    const fetchDataOptions = {
        columnFilters,
        pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sorting: sorting || []
    };

    const queryResult = dataLoadFn
        ? dataLoadFn(dataLoadArg ? Object.assign(fetchDataOptions, dataLoadArg) : fetchDataOptions)
        : null;

    const response = queryResult?.data;
    const isLoading = dataLoadFn ? queryResult?.isLoading : localIsLoading;
    const isError = dataLoadFn ? queryResult?.isError : localIsError;
    const refetch = queryResult?.refetch || onRefresh;
    const tableData = dataLoadFn ? response?.[dataProperty] || [] : data || [];
    const maxVisibleRows = fillHeight ? maxVisibleRowsProp || 10 : null;

    const table = useReactTable({
        columns,
        data: tableData,
        enableFilters: true,
        getRowId: (row, index) => String(row?.id ?? index),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: remote ? undefined : getFilteredRowModel(),
        getPaginationRowModel: remote ? undefined : getPaginationRowModel(),
        getSortedRowModel: remote ? undefined : getSortedRowModel(),
        manualFiltering: !!remote,
        manualPagination: !!remote,
        manualSorting: !!remote,
        pageCount: remote
            ? Math.ceil((response?.totalCount || 0) / pagination.pageSize) || -1
            : undefined,
        onPaginationChange: (nextValue) => {
            const nextPagination =
                typeof nextValue === 'function' ? nextValue(pagination) : nextValue;

            setPagination(nextPagination);
            if (onPageChanged) {
                onPageChanged(nextPagination.pageIndex);
            }
            if (onPageSizeChanged) {
                onPageSizeChanged(nextPagination.pageSize);
            }
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting: sorting || [],
            pagination,
            columnFilters,
            rowSelection
        }
    });
    const currentPageSize = table.getState().pagination.pageSize;

    useEffect(() => {
        for (const [columnId, filter] of Object.entries(defaultColumnFilters)) {
            table.getColumn(columnId)?.setFilterValue(filter);
        }
    }, [defaultColumnFilters, table]);

    useEffect(() => {
        if (fillHeight || !maxVisibleRows || !tableRef.current) {
            setMaxHeightPx(null);
            return;
        }

        const updateMaxHeight = () => {
            const container = tableRef.current;
            const headerRow = container?.querySelector('thead tr');
            const bodyRow = container?.querySelector('tbody tr');
            if (!container || !headerRow || !bodyRow) {
                return;
            }

            const headerHeight = Math.ceil(headerRow.getBoundingClientRect().height);
            const rowHeight = Math.ceil(bodyRow.getBoundingClientRect().height);
            setMaxHeightPx(headerHeight + rowHeight * maxVisibleRows);
        };

        updateMaxHeight();
        window.addEventListener('resize', updateMaxHeight);

        return () => window.removeEventListener('resize', updateMaxHeight);
    }, [currentPageSize, fillHeight, maxVisibleRows, tableData.length]);

    useEffect(() => {
        if (!onRowSelectionChange) {
            return;
        }

        onRowSelectionChange(table.getSelectedRowModel().flatRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

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
                            <FontAwesomeIcon icon={faRefresh} />
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

    const currPage = table.getState().pagination.pageIndex + 1;
    const pageCount = Math.max(1, table.getPageCount());
    const totalCount = remote ? response?.totalCount : tableData.length;
    const siblingsPerSide = 1;
    const windowStart = Math.max(2, currPage - siblingsPerSide);
    const windowEnd = Math.min(pageCount - 1, currPage + siblingsPerSide);
    const pageButtons = [];

    const addPageButton = (page) => {
        pageButtons.push(
            <Button
                key={page}
                size='sm'
                variant={page === currPage ? 'primary' : 'secondary'}
                onPress={() => table.setPageIndex(page - 1)}
            >
                {page}
            </Button>
        );
    };

    addPageButton(1);
    if (windowStart > 2) {
        pageButtons.push(
            <span key='start-ellipsis' className='px-1 text-xs text-muted'>
                ...
            </span>
        );
    }
    for (let page = windowStart; page <= windowEnd; page += 1) {
        addPageButton(page);
    }
    if (windowEnd < pageCount - 1) {
        pageButtons.push(
            <span key='end-ellipsis' className='px-1 text-xs text-muted'>
                ...
            </span>
        );
    }
    if (pageCount > 1) {
        addPageButton(pageCount);
    }

    return (
        <div
            className={`${fillHeight ? 'flex h-full min-h-0 flex-col' : ''} ${
                classNames?.base || ''
            }`}
        >
            {topContent}

            <div
                className={`${
                    fillHeight ? 'min-h-0 flex-1 overflow-auto' : 'overflow-x-auto'
                } rounded-lg border border-[color:var(--table-border)] bg-[var(--surface)] dark:border-zinc-700/60 dark:bg-black/35`}
                ref={tableRef}
                style={!fillHeight && maxHeightPx ? { maxHeight: `${maxHeightPx}px` } : undefined}
            >
                <table
                    className={`w-full text-sm text-foreground dark:text-zinc-100 ${tableClassName}`}
                >
                    <thead className='text-left text-xs text-[color:var(--table-header-text)] dark:text-zinc-300'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className='border-b border-[color:var(--table-header-border)] bg-[var(--table-header-bg)] dark:border-zinc-700/60 dark:bg-zinc-900/60'
                            >
                                {!disableSelection ? (
                                    <th className='w-10 px-2 py-2 align-middle'>
                                        <input
                                            type='checkbox'
                                            checked={table.getIsAllRowsSelected()}
                                            onChange={table.getToggleAllRowsSelectedHandler()}
                                        />
                                    </th>
                                ) : null}
                                {headerGroup.headers.map((header) =>
                                    header.isPlaceholder ? null : (
                                        <th
                                            key={header.id}
                                            className={`px-3 py-2 align-middle ${
                                                header.column.columnDef.meta?.className || ''
                                            }`}
                                            style={{
                                                width: header.column.columnDef.meta?.colWidth
                                            }}
                                        >
                                            {(() => {
                                                const columnClassName =
                                                    header.column.columnDef.meta?.className || '';
                                                const isDataColumn = Boolean(
                                                    header.column.columnDef.accessorKey ||
                                                        header.column.columnDef.accessorFn
                                                );
                                                const hasGroupingFilter = Boolean(
                                                    header.column.columnDef.meta?.groupingFilter
                                                );
                                                const isCenterAligned =
                                                    columnClassName.includes('text-center');
                                                const isRightAligned =
                                                    columnClassName.includes('text-right');
                                                const alignmentClass = isCenterAligned
                                                    ? 'justify-center text-center'
                                                    : isRightAligned
                                                    ? 'justify-end text-right'
                                                    : 'justify-start text-left';
                                                const showFilterIcon =
                                                    header.column.getCanFilter() &&
                                                    (hasGroupingFilter || isDataColumn) &&
                                                    header.column.columnDef.meta?.hideFilter !==
                                                        true;

                                                return (
                                                    <div className='flex items-center gap-1'>
                                                        <button
                                                            type='button'
                                                            className={`m-0 inline-flex w-full min-w-0 flex-grow items-center gap-1 border-0 bg-transparent p-0 ${alignmentClass}`}
                                                            disabled={!header.column.getCanSort()}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <span className='truncate'>
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </span>
                                                            {
                                                                {
                                                                    asc: (
                                                                        <FontAwesomeIcon
                                                                            icon={faArrowUpLong}
                                                                        />
                                                                    ),
                                                                    desc: (
                                                                        <FontAwesomeIcon
                                                                            icon={faArrowDownLong}
                                                                        />
                                                                    )
                                                                }[header.column.getIsSorted()]
                                                            }
                                                        </button>
                                                        {showFilterIcon ? (
                                                            <Popover
                                                                isOpen={
                                                                    isFilterPopOverOpen[header.id]
                                                                }
                                                                onOpenChange={(open) => {
                                                                    setFilterPopOverOpen(
                                                                        (previous) => ({
                                                                            ...previous,
                                                                            [header.id]: open
                                                                        })
                                                                    );
                                                                }}
                                                            >
                                                                <Popover.Trigger>
                                                                    <button
                                                                        type='button'
                                                                        className={`rounded px-1 py-0.5 text-xs ${
                                                                            header.column.getFilterValue()
                                                                                ? 'text-[color:var(--brand-red)]'
                                                                                : 'text-foreground/70 dark:text-zinc-300'
                                                                        }`}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faFilter}
                                                                        />
                                                                    </button>
                                                                </Popover.Trigger>
                                                                <Popover.Content offset={12}>
                                                                    <Popover.Dialog>
                                                                        {hasGroupingFilter ? (
                                                                            header.column.columnDef.meta.groupingFilter(
                                                                                header.getContext()
                                                                                    .table,
                                                                                () => {
                                                                                    setFilterPopOverOpen(
                                                                                        (
                                                                                            previous
                                                                                        ) => ({
                                                                                            ...previous,
                                                                                            [header.id]:
                                                                                                !previous[
                                                                                                    header
                                                                                                        .id
                                                                                                ]
                                                                                        })
                                                                                    );
                                                                                }
                                                                            )
                                                                        ) : (
                                                                            <Input
                                                                                autoFocus
                                                                                className='select-text min-w-[13rem]'
                                                                                placeholder='Filter'
                                                                                size='sm'
                                                                                variant='tertiary'
                                                                                value={
                                                                                    header.column
                                                                                        .getFilterValue()
                                                                                        ?.toString() ||
                                                                                    ''
                                                                                }
                                                                                onPointerDown={(
                                                                                    event
                                                                                ) => {
                                                                                    event.stopPropagation();
                                                                                }}
                                                                                onChange={(event) =>
                                                                                    header.column.setFilterValue(
                                                                                        event.target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Popover.Dialog>
                                                                </Popover.Content>
                                                            </Popover>
                                                        ) : null}
                                                    </div>
                                                );
                                            })()}
                                        </th>
                                    )
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        table.getHeaderGroups()[0].headers.length +
                                        (disableSelection ? 0 : 1)
                                    }
                                    className='px-3 py-4'
                                >
                                    {emptyContent || (
                                        <AlertPanel type='info'>
                                            {'There is no data to display'}
                                        </AlertPanel>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-[color:var(--table-border)] ${
                                        isStriped && index % 2 === 1
                                            ? 'bg-[var(--table-row-alt)] dark:bg-zinc-900/25'
                                            : 'bg-[var(--table-row-bg)]'
                                    } ${
                                        onRowClick
                                            ? 'cursor-pointer hover:bg-[var(--table-row-hover)] dark:hover:bg-zinc-800/35'
                                            : ''
                                    } ${getRowClassName ? getRowClassName(row) : ''}`}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {!disableSelection ? (
                                        <td className='w-10 px-2 py-2 align-middle'>
                                            <input
                                                type='checkbox'
                                                checked={row.getIsSelected()}
                                                onChange={row.getToggleSelectedHandler()}
                                                onClick={(event) => event.stopPropagation()}
                                            />
                                        </td>
                                    ) : null}
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`px-3 py-2 align-middle ${
                                                cell.column.columnDef.meta?.className || ''
                                            }`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className='mt-2 flex flex-wrap items-center gap-2'>
                <Select
                    aria-label='Page size'
                    className='w-24'
                    value={String(table.getState().pagination.pageSize)}
                    onChange={(value) => table.setPageSize(parseInt(String(value), 10))}
                >
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            {pageSizeOptions.map((pageSize) => (
                                <ListBox.Item
                                    key={pageSize.toString()}
                                    id={pageSize.toString()}
                                    textValue={pageSize.toString()}
                                >
                                    {pageSize.toString()}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
                <div className='inline-flex items-center gap-1'>
                    <Button
                        isDisabled={currPage <= 1}
                        size='sm'
                        variant='tertiary'
                        onPress={() => table.setPageIndex(Math.max(0, currPage - 2))}
                    >
                        {'<'}
                    </Button>
                    {pageButtons}
                    <Button
                        isDisabled={currPage >= pageCount}
                        size='sm'
                        variant='tertiary'
                        onPress={() => table.setPageIndex(Math.min(pageCount - 1, currPage))}
                    >
                        {'>'}
                    </Button>
                </div>
                <span className='text-sm text-muted'>
                    Page {currPage} of {pageCount} ({totalCount} items)
                </span>
            </div>
        </div>
    );
}

export default ReactTable;
