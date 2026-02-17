import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Button, Label, Spinner, TextArea, toast } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import ReactTable from '../Components/Table/ReactTable';
import {
    useAddNewsMutation,
    useDeleteNewsMutation,
    useGetNewsQuery,
    useSaveNewsMutation
} from '../redux/api';

const NewsAdmin = () => {
    const {
        data: newsResponse,
        isLoading: isNewsLoading,
        isError: isNewsError,
        error: newsError
    } = useGetNewsQuery({ limit: 50 });
    const [addNews, addResult] = useAddNewsMutation();
    const [saveNews, saveResult] = useSaveNewsMutation();
    const [deleteNews, deleteResult] = useDeleteNewsMutation();
    const news = newsResponse?.news || [];
    const [newsText, setNewsText] = useState('');
    const [editId, setEditId] = useState();
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (!addResult.isSuccess) {
            return;
        }

        toast.success('News item added successfully');
        addResult.reset();
    }, [addResult]);

    useEffect(() => {
        if (!saveResult.isSuccess) {
            return;
        }

        toast.success('News item saved successfully');
        saveResult.reset();
    }, [saveResult]);

    useEffect(() => {
        if (!deleteResult.isSuccess) {
            return;
        }

        toast.success('News item deleted successfully');
        deleteResult.reset();
    }, [deleteResult]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'datePublished',
                header: 'Published At',
                cell: ({ row }) => moment(row.original.datePublished).format('YYYY-MM-DD HH:mm')
            },
            {
                accessorKey: 'poster',
                header: 'Poster'
            },
            {
                accessorKey: 'text',
                header: 'Text',
                cell: ({ row }) => (
                    <div className='max-w-[72ch] truncate' title={row.original.text}>
                        {row.original.text}
                    </div>
                )
            }
        ],
        []
    );

    const hasSelection = selectedRows.length > 0;
    const isEditing = !!editId;
    const editorLabel = isEditing ? 'Edit news item' : 'Add new news item';

    const onSubmitEditor = () => {
        const trimmed = newsText.trim();
        if (!trimmed) {
            return;
        }

        if (isEditing) {
            saveNews({ id: editId, text: trimmed });
        } else {
            addNews(trimmed);
        }

        setNewsText('');
        setEditId(undefined);
    };

    const onDeleteSelected = () => {
        if (!hasSelection) {
            return;
        }

        selectedRows.forEach((row) => deleteNews(row.original.id));
        setSelectedRows([]);
    };

    return (
        <div className='space-y-3'>
            <Panel title='News administration' titleClass='text-base font-semibold tracking-wide'>
                {isNewsLoading ? (
                    <div className='flex items-center gap-2 text-sm text-muted'>
                        Please wait while the news is loaded...
                        <Spinner size='sm' />
                    </div>
                ) : (
                    <>
                        {isNewsError ? (
                            <ApiStatus
                                state={{
                                    loading: false,
                                    success: false,
                                    message:
                                        newsError?.data?.message ||
                                        newsError?.error ||
                                        'Error loading news'
                                }}
                                onClose={() => {}}
                            />
                        ) : null}
                        <p className='mb-2 text-sm text-foreground/88'>
                            Add a new news item below, or click an existing one to edit it.
                        </p>

                        <ReactTable
                            columns={columns}
                            data={news}
                            isStriped={false}
                            buttons={[
                                {
                                    label: 'Delete',
                                    variant: 'danger',
                                    onPress: onDeleteSelected,
                                    disabled: !hasSelection
                                }
                            ]}
                            onRowSelectionChange={setSelectedRows}
                            onRowClick={(row) => {
                                setEditId(row.original.id);
                                setNewsText(row.original.text);
                            }}
                            getRowClassName={(row) =>
                                editId === row.original.id
                                    ? 'bg-[var(--table-selected-bg)] hover:bg-[var(--table-selected-bg-hover)]'
                                    : ''
                            }
                        />
                    </>
                )}
            </Panel>

            <Panel title={editorLabel} titleClass='text-base font-semibold tracking-wide'>
                <div className='space-y-2'>
                    <Label className='sr-only'>{editorLabel}</Label>
                    <TextArea
                        className='w-full'
                        rows={4}
                        name='newsText'
                        placeholder='Enter new news text'
                        value={newsText}
                        onChange={(event) => setNewsText(event.target.value)}
                    />
                    <div className='flex items-center gap-2'>
                        <Button
                            type='button'
                            variant='tertiary'
                            onPress={onSubmitEditor}
                            isDisabled={!newsText.trim()}
                        >
                            {isEditing ? 'Save' : 'Add'}
                        </Button>
                        {isEditing ? (
                            <Button
                                type='button'
                                variant='secondary'
                                onPress={() => {
                                    setEditId(undefined);
                                    setNewsText('');
                                }}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>
                </div>
            </Panel>
        </div>
    );
};

NewsAdmin.displayName = 'NewsAdmin';

export default NewsAdmin;
