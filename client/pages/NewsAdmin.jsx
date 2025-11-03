// @ts-nocheck
import React, { useState } from 'react';
import moment from 'moment';
import Button from '../Components/HeroUI/Button';
import { Textarea, Spinner } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import AlertPanel, { AlertType } from '../Components/Site/AlertPanel';
import {
    useLoadNewsQuery,
    useAddNewsMutation,
    useSaveNewsMutation,
    useDeleteNewsMutation
} from '../redux/slices/apiSlice';

const NewsAdmin = () => {
    const { data: news = [], isLoading, error } = useLoadNewsQuery(undefined);
    const [addNews, { isLoading: isAdding, isSuccess: addSuccess }] = useAddNewsMutation();
    const [saveNews, { isLoading: isSaving, isSuccess: saveSuccess }] = useSaveNewsMutation();
    const [
        deleteNews,
        { isLoading: isDeleting, isSuccess: deleteSuccess }
    ] = useDeleteNewsMutation();

    const [newsText, setNewsText] = useState('');
    const [editText, setEditText] = useState('');
    const [editId, setEditId] = useState();

    const renderedNews = news.map((newsItem) => {
        return (
            <tr key={newsItem.id}>
                <td className='p-2'>{moment(newsItem.datePublished).format('YYYY-MM-DD')}</td>
                <td className='p-2'>{newsItem.poster}</td>
                <td className='p-2'>
                    {editId === newsItem.id ? (
                        <Textarea minRows={4} value={editText} onValueChange={setEditText} />
                    ) : (
                        newsItem.text
                    )}
                </td>
                <td className='p-2'>
                    <div className='flex gap-2'>
                        {editId === newsItem.id ? (
                            <Button
                                color='primary'
                                isLoading={isSaving}
                                onPress={async () => {
                                    try {
                                        await saveNews({ id: editId, text: editText }).unwrap();
                                        setEditId(undefined);
                                        setEditText('');
                                    } catch (err) {
                                        // Error handled by RTK Query
                                    }
                                }}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                color='primary'
                                onPress={() => {
                                    setEditId(newsItem.id);
                                    setEditText(newsItem.text);
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        <Button
                            color='danger'
                            isLoading={isDeleting}
                            onPress={() => deleteNews(newsItem.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </td>
            </tr>
        );
    });

    return (
        <div className='max-w-7xl mx-auto'>
            <Panel title='News Admin'>
                {isLoading && (
                    <div className='flex items-center gap-2'>
                        Please wait while the news is loaded...
                        <Spinner size='sm' />
                    </div>
                )}
                {error && (
                    <div className='text-red-500 mb-4'>
                        Error loading news: {error?.data?.message || 'Unknown error'}
                    </div>
                )}
                {!isLoading && (
                    <>
                        {addSuccess && (
                            <AlertPanel
                                type={AlertType.Success}
                                title=''
                                message='News item added successfully'
                            />
                        )}
                        {saveSuccess && (
                            <AlertPanel
                                type={AlertType.Success}
                                title=''
                                message='News item saved successfully'
                            />
                        )}
                        {deleteSuccess && (
                            <AlertPanel
                                type={AlertType.Success}
                                title=''
                                message='News item deleted successfully'
                            />
                        )}
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b border-gray-700'>
                                        <th className='p-2 text-left w-32'>Date</th>
                                        <th className='p-2 text-left w-32'>Poster</th>
                                        <th className='p-2 text-left'>Text</th>
                                        <th className='p-2 text-left w-64'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>{renderedNews}</tbody>
                            </table>
                        </div>

                        <div className='mt-6 space-y-4'>
                            <Textarea
                                label='Add news item'
                                minRows={4}
                                value={newsText}
                                onValueChange={setNewsText}
                            />

                            <Button
                                color='primary'
                                isLoading={isAdding}
                                onPress={async () => {
                                    try {
                                        await addNews({ text: newsText }).unwrap();
                                        setNewsText('');
                                    } catch (err) {
                                        // Error handled by RTK Query
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </>
                )}
            </Panel>
        </div>
    );
};

NewsAdmin.displayName = 'NewsAdmin';

export default NewsAdmin;
