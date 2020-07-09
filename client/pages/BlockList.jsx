import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Button, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';

import Panel from '../Components/Site/Panel';
import {
    loadBlockList,
    addBlockListEntry,
    clearApiStatus,
    removeBlockListEntry,
    sendSocketMessage
} from '../redux/actions';

import './BlockList.scss';
import { UserAction } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';

const BlockList = () => {
    const { user, token } = useSelector((state) => ({
        user: state.account.user,
        token: state.account.token
    }));
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const blockList = useSelector((state) => state.user.blockList);
    const addState = useSelector((state) => {
        const retState = state.api[UserAction.AddBlocklist];

        if (retState && retState.success) {
            retState.message = t('Blocklist entry added successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(UserAction.AddBlocklist));
            }, 5000);
        }

        return retState;
    });
    const deleteState = useSelector((state) => {
        const retState = state.api[UserAction.DeleteBlockList];

        if (retState && retState.success) {
            retState.message = t('Blocklist entry deleted successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(UserAction.DeleteBlockList));
                dispatch(sendSocketMessage('authenticate', token));
            }, 5000);
        }

        return retState;
    });
    const apiState = useSelector((state) => state.api[UserAction.RequestBlocklist]);

    useEffect(() => {
        if (user) {
            dispatch(loadBlockList(user));
        }
    }, [user, dispatch]);

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
                        onClick={() => dispatch(removeBlockListEntry(user, username))}
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
                {apiState?.loading && (
                    <div>
                        Please wait while the blocklist is loaded...
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    </div>
                )}
                {!apiState ||
                    (!apiState.loading && (
                        <>
                            <ApiStatus
                                state={addState}
                                onClose={() => dispatch(clearApiStatus(UserAction.AddBlocklist))}
                            />
                            <ApiStatus
                                state={deleteState}
                                onClose={() => dispatch(clearApiStatus(UserAction.DeleteBlockList))}
                            />
                            <div className='about-container'>
                                <Formik
                                    validationSchema={schema}
                                    onSubmit={(values) => {
                                        dispatch(addBlockListEntry(user, values.blockee));
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
                                                    It can sometimes become necessary to prevent
                                                    someone joining your games, or stop seeing their
                                                    messages, or both. Users on this list will not
                                                    be able to join your games, and you will not see
                                                    their chat messages or their games.
                                                </Trans>
                                            </p>
                                            <Form.Row>
                                                <Form.Group
                                                    as={Col}
                                                    xs='9'
                                                    controlId='formGridblockee'
                                                >
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
                                            </Form.Row>

                                            <Button variant='primary' type='submit'>
                                                <Trans>Add</Trans>
                                                &nbsp;
                                                {addState && addState.loading && (
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
                    ))}
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
