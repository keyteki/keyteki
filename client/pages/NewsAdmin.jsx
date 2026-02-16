import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Button, Label, Spinner, TextArea } from '@heroui/react';

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
    const [editText, setEditText] = useState('');
    const [editId, setEditId] = useState();

    const toApiStatus = (result, successMessage) => {
        if (!result || result.isUninitialized) {
            return null;
        }

        return {
            loading: result.isLoading,
            success: result.isSuccess,
            message: result.isError
                ? result.error?.data?.message || result.error?.error || 'An error occurred'
                : result.isSuccess
                ? successMessage
                : undefined
        };
    };

    const addApiState = useMemo(
        () => toApiStatus(addResult, 'News item added successfully'),
        [addResult]
    );
    const saveApiState = useMemo(
        () => toApiStatus(saveResult, 'News item saved successfully'),
        [saveResult]
    );
    const deleteApiState = useMemo(
        () => toApiStatus(deleteResult, 'News item deleted successfully'),
        [deleteResult]
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'datePublished',
                header: 'Date',
                cell: ({ row }) => moment(row.original.datePublished).format('YYYY-MM-DD')
            },
            {
                accessorKey: 'poster',
                header: 'Poster'
            },
            {
                accessorKey: 'text',
                header: 'Text',
                cell: ({ row }) =>
                    editId === row.original.id ? (
                        <TextArea
                            rows={3}
                            name='editText'
                            value={editText}
                            onChange={(event) => setEditText(event.target.value)}
                        />
                    ) : (
                        row.original.text
                    )
            },
            {
                id: 'action',
                header: 'Action',
                cell: ({ row }) => (
                    <div className='flex gap-2'>
                        {editId === row.original.id ? (
                            <Button
                                type='button'
                                size='sm'
                                variant='secondary'
                                onClick={() => {
                                    saveNews({ id: editId, text: editText });
                                    setEditId(undefined);
                                    setEditText('');
                                }}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                type='button'
                                size='sm'
                                variant='secondary'
                                onClick={() => {
                                    setEditId(row.original.id);
                                    setEditText(row.original.text);
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        <Button
                            type='button'
                            size='sm'
                            variant='danger'
                            onClick={() => deleteNews(row.original.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            }
        ],
        [deleteNews, editId, editText, saveNews]
    );

    return (
        <Panel title='News Admin'>
            {isNewsLoading ? (
                <div className='flex items-center gap-2 text-sm text-zinc-300'>
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
                    <ApiStatus state={addApiState} onClose={() => addResult.reset()} />
                    <ApiStatus state={saveApiState} onClose={() => saveResult.reset()} />
                    <ApiStatus state={deleteApiState} onClose={() => deleteResult.reset()} />

                    <ReactTable columns={columns} data={news} disableSelection isStriped={false} />

                    <div className='mt-3'>
                        <Label className='mb-1 block text-sm text-zinc-200'>Add news item</Label>
                        <TextArea
                            rows={4}
                            name='newsText'
                            value={newsText}
                            onChange={(event) => setNewsText(event.target.value)}
                        />
                        <Button
                            type='button'
                            className='mt-2'
                            variant='secondary'
                            onClick={() => {
                                addNews(newsText);
                                setNewsText('');
                            }}
                        >
                            Add
                        </Button>
                    </div>
                </>
            )}
        </Panel>
    );
};

NewsAdmin.displayName = 'NewsAdmin';

export default NewsAdmin;
