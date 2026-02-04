import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Table, Form, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
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
    } = useGetNewsQuery({ limit: 5 });
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
                                    saveNews({ id: editId, text: editText });
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
                            onClick={() => deleteNews(newsItem.id)}
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
                {isNewsLoading && (
                    <div>
                        Please wait while the news is loaded...
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    </div>
                )}
                {!isNewsLoading && (
                    <>
                        {isNewsError && (
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
                        )}
                        <ApiStatus state={addApiState} onClose={() => addResult.reset()} />
                        <ApiStatus state={saveApiState} onClose={() => saveResult.reset()} />
                        <ApiStatus state={deleteApiState} onClose={() => deleteResult.reset()} />
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
                                    addNews(newsText);
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
