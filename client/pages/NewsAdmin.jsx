import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Button from '../Components/HeroUI/Button';
import { Textarea, Spinner } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import { loadNews, saveNews, deleteNews, clearApiStatus, addNews } from '../redux/actions';
import { News } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';

const NewsAdmin = () => {
    const news = useSelector((state) => state.news.news);
    const [newsText, setNewsText] = useState('');
    const [editText, setEditText] = useState('');
    const [editId, setEditId] = useState();
    const dispatch = useDispatch();

    const apiState = useSelector((state) => {
        const retState = state.api[News.RequestNews];

        return retState;
    });

    const addApiState = useSelector((state) => {
        const retState = state.api[News.AddNews];

        if (retState && retState.success) {
            retState.message = 'News item added successfully';

            setTimeout(() => {
                dispatch(clearApiStatus(News.AddNews));
            }, 5000);
        }

        return retState;
    });

    const saveApiState = useSelector((state) => {
        const retState = state.api[News.SaveNews];

        if (retState && retState.success) {
            retState.message = 'News item saved successfully';

            setTimeout(() => {
                dispatch(clearApiStatus(News.SaveNews));
            }, 5000);
        }

        return retState;
    });

    const deleteApiState = useSelector((state) => {
        const retState = state.api[News.DeleteNews];

        if (retState && retState.success) {
            retState.message = 'News item deleted successfully';

            setTimeout(() => {
                dispatch(clearApiStatus(News.DeleteNews));
            }, 5000);
        }

        return retState;
    });

    useEffect(() => {
        dispatch(loadNews({ limit: 5, forceLoad: true }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                onPress={() => {
                                    dispatch(saveNews(editId, editText));
                                    setEditId(undefined);
                                    setEditText(undefined);
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
                        <Button color='danger' onPress={() => dispatch(deleteNews(newsItem.id))}>
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
                {apiState?.loading && (
                    <div className='flex items-center gap-2'>
                        Please wait while the news is loaded...
                        <Spinner size='sm' />
                    </div>
                )}
                {!apiState?.loading && (
                    <>
                        {!apiState?.success && (
                            <ApiStatus
                                state={apiState}
                                onClose={() => dispatch(clearApiStatus(News.RequestNews))}
                            />
                        )}
                        <ApiStatus
                            state={addApiState}
                            onClose={() => dispatch(clearApiStatus(News.AddNews))}
                        />
                        <ApiStatus
                            state={saveApiState}
                            onClose={() => dispatch(clearApiStatus(News.SaveNews))}
                        />
                        <ApiStatus
                            state={deleteApiState}
                            onClose={() => dispatch(clearApiStatus(News.DeleteNews))}
                        />
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
                                onPress={() => {
                                    dispatch(addNews(newsText));
                                    setNewsText('');
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
