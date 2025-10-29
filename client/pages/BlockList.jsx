import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/HeroUI/Button';
import { Input, Spinner } from '@heroui/react';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
            <div className='overflow-x-auto'>
                <table className='w-full blocklist'>
                    <thead>
                        <tr className='border-b border-gray-700'>
                            <th className='p-2 text-left'>
                                <Trans>Username</Trans>
                            </th>
                            <th className='p-2 text-left w-24'>
                                <Trans>Remove</Trans>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{blockListToRender}</tbody>
                </table>
            </div>
        );

    const schema = yup.object({
        blockee: yup.string().required(t('You must specify a username to block'))
    });

    return (
        <div className='max-w-4xl mx-auto'>
            <Panel title={t('Block list')}>
                {apiState?.loading && (
                    <div className='flex items-center gap-2'>
                        Please wait while the blocklist is loaded...
                        <Spinner size='sm' />
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
                                        <form
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
                                            <div className='max-w-md mb-4'>
                                                <Input
                                                    name='blockee'
                                                    type='text'
                                                    label={t('Username')}
                                                    placeholder={t('Enter username to block')}
                                                    value={formProps.values.blockee}
                                                    onChange={formProps.handleChange}
                                                    onBlur={formProps.handleBlur}
                                                    isInvalid={
                                                        formProps.touched.blockee &&
                                                        !!formProps.errors.blockee
                                                    }
                                                    errorMessage={formProps.errors.blockee}
                                                />
                                            </div>

                                            <Button color='primary' type='submit'>
                                                <Trans>Add</Trans>
                                                &nbsp;
                                                {addState && addState.loading && (
                                                    <Spinner size='sm' className='ml-2' />
                                                )}
                                            </Button>

                                            <div className='mt-6'>
                                                <h3 className='font-bold text-lg mb-3'>
                                                    <Trans>Users Blocked</Trans>
                                                </h3>
                                                {table}
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </div>
                        </>
                    ))}
            </Panel>
        </div>
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
