import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import {
    useAddBlockListEntryMutation,
    useGetBlockListQuery,
    useRemoveBlockListEntryMutation
} from '../redux/api';
import { userActions } from '../redux/slices/userSlice';
import { lobbyAuthenticateRequested } from '../redux/socketActions';

import './BlockList.scss';

const BlockList = () => {
    const { user } = useSelector((state) => ({
        user: state.account.user
    }));
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const blockList = useSelector((state) => state.user.blockList);
    const [addBlockListEntry, addState] = useAddBlockListEntryMutation();
    const [removeBlockListEntry, deleteState] = useRemoveBlockListEntryMutation();
    const { isLoading: isBlockListLoading } = useGetBlockListQuery(user?.username, {
        skip: !user
    });

    useEffect(() => {
        if (addState.isSuccess) {
            const timeoutId = setTimeout(() => {
                addState.reset();
                dispatch(userActions.clearBlockListStatus());
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [addState, dispatch]);

    useEffect(() => {
        if (deleteState.isSuccess) {
            const timeoutId = setTimeout(() => {
                deleteState.reset();
                dispatch(lobbyAuthenticateRequested());
                dispatch(userActions.clearBlockListStatus());
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [deleteState, dispatch]);

    const initialValues = {
        blockee: ''
    };

    if (!blockList) {
        return null;
    }

    let blockListToRender = blockList.map((username) => {
        return (
            <tr key={username}>
                <td>{username}</td>
                <td>
                    <a
                        href='#'
                        className='text-danger'
                        onClick={() =>
                            removeBlockListEntry({
                                username: user.username,
                                blockee: username
                            })
                        }
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </a>
                </td>
            </tr>
        );
    });

    let table =
        blockList && blockList.length === 0 ? (
            <div>
                <Trans>No users currently blocked</Trans>
            </div>
        ) : (
            <Table striped className='blocklist'>
                <thead>
                    <tr>
                        <th>
                            <Trans>Username</Trans>
                        </th>
                        <th>
                            <Trans>Remove</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody>{blockListToRender}</tbody>
            </Table>
        );

    const schema = yup.object({
        blockee: yup.string().required(t('You must specify a username to block'))
    });

    return (
        <Col sm={{ offset: 2, span: 8 }}>
            <Panel title={t('Block list')}>
                {isBlockListLoading && (
                    <div>
                        Please wait while the blocklist is loaded...
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    </div>
                )}
                {!isBlockListLoading && (
                    <>
                        <ApiStatus
                            state={
                                addState.isUninitialized
                                    ? null
                                    : {
                                          loading: addState.isLoading,
                                          success: addState.isSuccess,
                                          message: addState.isSuccess
                                              ? t('Blocklist entry added successfully')
                                              : addState.error?.data?.message
                                      }
                            }
                            onClose={() => addState.reset()}
                        />
                        <ApiStatus
                            state={
                                deleteState.isUninitialized
                                    ? null
                                    : {
                                          loading: deleteState.isLoading,
                                          success: deleteState.isSuccess,
                                          message: deleteState.isSuccess
                                              ? t('Blocklist entry deleted successfully')
                                              : deleteState.error?.data?.message
                                      }
                            }
                            onClose={() => deleteState.reset()}
                        />
                        <div className='about-container'>
                            <Formik
                                validationSchema={schema}
                                onSubmit={(values) => {
                                    addBlockListEntry({
                                        username: user.username,
                                        blockee: values.blockee
                                    });
                                }}
                                initialValues={initialValues}
                            >
                                {(formProps) => (
                                    <Form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            formProps.handleSubmit(event);
                                        }}
                                    >
                                        <p>
                                            <Trans i18nKey='blocklist.explain'>
                                                It can sometimes become necessary to prevent someone
                                                joining your games, or stop seeing their messages,
                                                or both. Users on this list will not be able to join
                                                your games, and you will not see their chat messages
                                                or their games.
                                            </Trans>
                                        </p>
                                        <Row>
                                            <Form.Group as={Col} xs='9' controlId='formGridblockee'>
                                                <Form.Label>{t('Username')}</Form.Label>
                                                <Form.Control
                                                    name='blockee'
                                                    type='text'
                                                    placeholder={t('Enter username to block')}
                                                    value={formProps.values.blockee}
                                                    onChange={formProps.handleChange}
                                                    onBlur={formProps.handleBlur}
                                                    isInvalid={
                                                        formProps.touched.blockee &&
                                                        !!formProps.errors.blockee
                                                    }
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {formProps.errors.blockee}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        <Button variant='primary' type='submit'>
                                            <Trans>Add</Trans>
                                            &nbsp;
                                            {addState.isLoading && (
                                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                            )}
                                        </Button>

                                        <div className='mt-3'>
                                            <h3 className='font-weight-bold'>
                                                <Trans>Users Blocked</Trans>
                                            </h3>
                                            {table}
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </>
                )}
            </Panel>
        </Col>
    );
};

BlockList.displayName = 'BlockList';

// function mapStateToProps(state) {
//     return {
//         apiLoading: state.api.ADD_BLOCKLIST ? state.api.ADD_BLOCKLIST.loading : undefined,
//         apiMessage: state.api.ADD_BLOCKLIST ? state.api.ADD_BLOCKLIST.message : undefined,
//         apiSuccess: state.api.ADD_BLOCKLIST ? state.api.ADD_BLOCKLIST.success : undefined,
//         blockList: state.user.blockList,
//         blockListAdded: state.user.blockListAdded,
//         blockListDeleted: state.user.blockListDeleted,
//         socket: state.lobby.socket,
//         token: state.account.token,
//         user: state.account.user
//     };
// }

export default BlockList;
