import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel
} from '@tanstack/react-table';

import LoadingSpinner from '../Site/LoadingSpinner';
import {
    faLongArrowAltDown,
    faLongArrowAltUp,
    faFilter,
    faArrowsAlt,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import FaIconButton from '../Site/FaIconButton';
import {
    Button,
    Input,
    Pagination,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@heroui/react';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// eslint-disable-next-line react/display-name
const TableWrapper = forwardRef(({ children }, ref) => {
    return (
        <div className='h-full overflow-y-auto'>
            <table ref={ref}>{children}</table>
        </div>
    );
});

function ReactTable({
    buttons = [],
    columns,
    dataLoadFn,
    dataLoadArg = null,
    dataProperty = 'data',
    defaultColumnFilters = {},
    defaultSort,
    disableSelection = false,
    emptyContent,
    onRowClick,
    onRowSelectionChange,
    onPageChanged,
    startPageNumber = 0,
    selectedRows,
    remote = false,
    classNames,
    isStriped = true
}) {
    const tableRef = useRef(null);
    const defaultFiltersApplied = useRef(false);
    const [pagination, setPagination] = useState({
        pageIndex: startPageNumber,
        pageSize: 10
    });
    const [sorting, setSorting] = useState(defaultSort);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState(selectedRows || new Set([]));
    const [isFilterPopOverOpen, setFilterPopOverOpen] = useState({});

    useEffect(() => {
        setRowSelection(selectedRows || new Set([]));
    }, [selectedRows]);

    const fetchDataOptions = useMemo(
        () => ({
            columnFilters,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            sorting: sorting || []
        }),
        [columnFilters, pagination.pageIndex, pagination.pageSize, sorting]
    );

    const { data: response, isLoading, isError, refetch } = dataLoadFn(
        dataLoadArg ? Object.assign({}, fetchDataOptions, dataLoadArg) : fetchDataOptions
    );

    let tableOptions;

    if (remote) {
        tableOptions = {
            data: response ? response[dataProperty] : null,
            columns,
            enableFilters: true,
            getCoreRowModel: getCoreRowModel(),
            manualFiltering: true,
            manualPagination: true,
            manualSorting: true,
            onPaginationChange: setPagination,
            onColumnFiltersChange: setColumnFilters,
            onSortingChange: setSorting,
            pageCount: Math.ceil(response?.totalCount / pagination.pageSize) ?? -1,
            state: {
                sorting: sorting || [],
                pagination: pagination,
                columnFilters: columnFilters,
                rowSelection: [...rowSelection].reduce((keys, v) => {
                    keys[v] = true;
                    return keys;
                }, {})
            }
        };
    } else {
        tableOptions = {
            columns,
            data: response ? response[dataProperty] : null,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            onPaginationChange: (pi) => {
                setPagination(pi);
                onPageChanged(table.getState().pagination.pageIndex);
            },
            state: {
                sorting,
                rowSelection: [...rowSelection].reduce((keys, v) => {
                    keys[v] = true;
                    return keys;
                }, {}),
                pagination,
                columnFilters
            }
        };
    }

    const table = useReactTable(tableOptions);

    const topContent = useMemo(
        () => (
            <div className='flex justify-between'>
                <div className='flex gap-2 flex-wrap'>
                    {buttons.map((b) => (
                        <Button
                            key={b.label}
                            color={b.color}
                            endContent={b.icon}
                            onPress={b.onPress}
                            isDisabled={b.disabled}
                            isLoading={b.isLoading}
                        >
                            {b.label}
                        </Button>
                    ))}
                    {refetch && (
                        <FaIconButton
                            color='default'
                            icon={faArrowsAlt}
                            onPress={() => refetch()}
                        ></FaIconButton>
                    )}
                </div>
            </div>
        ),
        [buttons, refetch]
    );

    useEffect(() => {
        if (!defaultFiltersApplied.current && Object.keys(defaultColumnFilters).length > 0) {
            for (const [columnId, filter] of Object.entries(defaultColumnFilters)) {
                table.getColumn(columnId)?.setFilterValue(filter);
            }
            defaultFiltersApplied.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultColumnFilters]);

    useEffect(() => {
        if (rowSelection === 'all' || rowSelection.size > 0) {
            onRowSelectionChange && onRowSelectionChange(table.getSelectedRowModel().flatRows);
        } else {
            onRowSelectionChange && onRowSelectionChange([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    if (isLoading) {
        return <LoadingSpinner />;
    } else if (isError) {
        return <AlertPanel variant='danger'>{'An error occurred loading data.'}</AlertPanel>;
    }

    const currPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();
    const totalCount = remote ? response?.totalCount : response[dataProperty]?.length || 0;

    const tableFooter = (
        <div className='flex flex-col'>
            <div className='flex flex-wrap gap-1 items-center'>
                <Pagination
                    className='w-full sm:w-auto'
                    total={pageCount}
                    showControls
                    initialPage={table.getState().pagination.pageIndex + 1}
                    onChange={(page) => table.setPageIndex(page - 1)}
                />
                <Select
                    className='w-20 sm:order-first'
                    onChange={(e) => {
                        table.setPageSize(parseInt(e.target.value));
                    }}
                    disallowEmptySelection
                    selectedKeys={new Set([table.getState().pagination.pageSize.toString()])}
                    classNames={{ base: 'sm:order-first', trigger: 'h-9' }}
                    aria-label='Page Select'
                >
                    {[10, 25, 50].map((pageSize) => (
                        <SelectItem key={pageSize.toString()} value={pageSize}>
                            {pageSize.toString()}
                        </SelectItem>
                    ))}
                </Select>
                <span className='w-52 sm:w-full'>
                    Page {currPage} of {pageCount} ({totalCount} items)
                </span>
            </div>
        </div>
    );
    const tableClassNames = { ...{ base: 'h-full' }, ...classNames };
    return (
        <>
            <Table
                isStriped={isStriped}
                isHeaderSticky
                showSelectionCheckboxes
                selectionMode={disableSelection ? 'none' : 'multiple'}
                selectedKeys={rowSelection}
                onSelectionChange={setRowSelection}
                onRowAction={(key) => onRowClick && onRowClick(table.getRowModel().rows[key])}
                topContent={topContent}
                bottomContent={tableFooter}
                removeWrapper
                classNames={tableClassNames}
                as={TableWrapper}
                ref={tableRef}
                aria-label='Generic Table'
            >
                <TableHeader>
                    {table.getHeaderGroups()[0].headers.map((header) =>
                        header.isPlaceholder ? null : (
                            <TableColumn
                                className={header.column.columnDef.meta?.className}
                                key={header.id}
                                width={header.column.columnDef.meta?.colWidth}
                                allowsSorting={false}
                            >
                                {/* // Filter column via built-in input */}
                                {header.column.getCanFilter() &&
                                !header.column.columnDef.meta?.groupingFilter ? (
                                    <div className='flex items-center'>
                                        <FontAwesomeIcon icon={faSearch} />
                                        <Input
                                            className='select-text'
                                            onPointerDown={(e) => {
                                                // Something steals focus, probably the parent, without this code
                                                e.target.focus();
                                                e.stopPropagation();
                                                e.preventDefault();
                                            }}
                                            onKeyDown={() => {
                                                // Something is preventing space key from changing value; overriding this event fixes it
                                                return;
                                            }}
                                            onValueChange={header.column.setFilterValue}
                                            onClear={() => header.column.setFilterValue('')}
                                            value={header.column.getFilterValue() || ''}
                                            size='sm'
                                            isClearable
                                            label={header.column.columnDef.header}
                                            classNames={{
                                                inputWrapper: 'px-2',
                                                label: 'text-tiny'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className='flex gap-1 items-center'
                                        role={header.column.getCanSort() ? 'button' : ''}
                                        onPointerDown={header.column.getToggleSortingHandler()}
                                    >
                                        <span className='flex-grow-1'>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </span>
                                        {
                                            {
                                                asc: <FontAwesomeIcon icon={faLongArrowAltUp} />,
                                                desc: <FontAwesomeIcon icon={faLongArrowAltDown} />
                                            }[header.column.getIsSorted()]
                                        }
                                        {/* // Filter column via custom grouping filter */}
                                        {header.column.getCanFilter() &&
                                            header.column.columnDef.meta?.groupingFilter && (
                                                <Popover
                                                    isOpen={isFilterPopOverOpen[header.id]}
                                                    onOpenChange={(open) => {
                                                        isFilterPopOverOpen[header.id] = open;
                                                        setFilterPopOverOpen({
                                                            ...isFilterPopOverOpen
                                                        });
                                                    }}
                                                    offset={20}
                                                    portalContainer={tableRef.current}
                                                >
                                                    <PopoverTrigger>
                                                        <FontAwesomeIcon icon={faFilter} />
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        {header.column.columnDef.meta?.groupingFilter(
                                                            header.getContext().table,
                                                            () => {
                                                                isFilterPopOverOpen[
                                                                    header.id
                                                                ] = !isFilterPopOverOpen[header.id];
                                                                setFilterPopOverOpen({
                                                                    ...isFilterPopOverOpen
                                                                });
                                                            }
                                                        )}
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                    </div>
                                )}
                            </TableColumn>
                        )
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    loadingContent={<LoadingSpinner label='Loading data...' />}
                    emptyContent={
                        emptyContent || (
                            <AlertPanel variant={AlertType.Info}>
                                {'There is no data to display'}
                            </AlertPanel>
                        )
                    }
                >
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={cell.column.columnDef.meta?.className}
                                >
                                    <div>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default ReactTable;
