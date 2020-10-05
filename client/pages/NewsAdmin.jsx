import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Table, Form, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

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
            <tr key={newsItem.id} className='d-flex'>
                <td className='col-2'>{moment(newsItem.datePublished).format('YYYY-MM-DD')}</td>
                <td className='col-2'>{newsItem.poster}</td>
                <td className='col'>
                    {editId === newsItem.id ? (
                        <Form.Control
                            as='textarea'
                            rows={4}
                            name='editText'
                            value={editText}
                            onChange={(event) => setEditText(event.target.value)}
                        />
                    ) : (
                        newsItem.text
                    )}
                </td>
                <td className='col-3'>
                    <div className='btn-group'>
                        {editId === newsItem.id ? (
                            <Button
                                variant='primary'
                                type='button'
                                onClick={() => {
                                    dispatch(saveNews(editId, editText));
                                    setEditId(undefined);
                                    setEditText(undefined);
                                }}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                variant='primary'
                                type='button'
                                onClick={() => {
                                    setEditId(newsItem.id);
                                    setEditText(newsItem.text);
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        <Button
                            variant='danger'
                            type='button'
                            onClick={() => dispatch(deleteNews(newsItem.id))}
                        >
                            Delete
                        </Button>
                    </div>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <Panel title='News Admin'>
                {apiState?.loading && (
                    <div>
                        Please wait while the news is loaded...
                        <FontAwesomeIcon icon={faCircleNotch} spin />
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
                        <Table striped>
                            <thead>
                                <tr className='d-flex'>
                                    <th className='col-2'>Date</th>
                                    <th className='col-2'>Poster</th>
                                    <th className='col'>Text</th>
                                    <th className='col-3'>Action</th>
                                </tr>
                            </thead>
                            <tbody>{renderedNews}</tbody>
                        </Table>

                        <Form>
                            <Form.Group controlId='newsText' as={Col} xs={12}>
                                <Form.Label>Add news item</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={4}
                                    name='newsText'
                                    value={newsText}
                                    onChange={(event) => setNewsText(event.target.value)}
                                />
                            </Form.Group>

                            <Button
                                variant='primary'
                                type='button'
                                onClick={() => {
                                    dispatch(addNews(newsText));
                                    setNewsText('');
                                }}
                            >
                                Add
                            </Button>
                        </Form>
                    </>
                )}
            </Panel>
        </div>
    );
};

NewsAdmin.displayName = 'NewsAdmin';

export default NewsAdmin;
