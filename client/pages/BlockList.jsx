import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/HeroUI/Button';
import { Input, Spinner } from '@heroui/react';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';

import Panel from '../Components/Site/Panel';
import { sendSocketMessage } from '../redux/actions/socket';
import {
    useLoadBlocklistQuery,
    useAddBlocklistEntryMutation,
    useRemoveBlocklistEntryMutation
} from '../redux/slices/apiSlice';

const BlockList = () => {
    const { user, token } = useSelector((state) => ({
        user: state.account.user,
        token: state.account.token
    }));
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { data: blockList = [], isLoading, error } = useLoadBlocklistQuery(user?.username, {
        skip: !user
    });

    const [
        addBlocklistEntry,
        { isLoading: isAdding, isSuccess: addSuccess, reset: resetAdd }
    ] = useAddBlocklistEntryMutation();

    const [
        removeBlocklistEntry,
        { isSuccess: deleteSuccess, reset: resetDelete }
    ] = useRemoveBlocklistEntryMutation();

    const initialValues = {
        blockee: ''
    };

    let blockListToRender = blockList.map((username) => {
        return (
            <tr key={username}>
                <td className='align-middle'>{username}</td>
                <td className='align-middle'>
                    <a
                        href='#'
                        className='text-red-500 hover:underline'
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                await removeBlocklistEntry({
                                    username: user.username,
                                    blockedUsername: username
                                }).unwrap();
                                dispatch(sendSocketMessage('authenticate', token));
                            } catch (err) {
                                // Error handled by RTK Query
                            }
                        }}
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
                {isLoading && (
                    <div className='flex items-center gap-2'>
                        Please wait while the blocklist is loaded...
                        <Spinner size='sm' />
                    </div>
                )}
                {error && (
                    <div className='text-red-500 mb-4'>
                        Error loading blocklist: {error.message || 'Unknown error'}
                    </div>
                )}
                {!isLoading && (
                    <>
                        {addSuccess && (
                            <div className='bg-green-600 text-white p-3 rounded mb-4'>
                                {t('Blocklist entry added successfully')}
                                <button onClick={resetAdd} className='float-right'>
                                    ×
                                </button>
                            </div>
                        )}
                        {deleteSuccess && (
                            <div className='bg-green-600 text-white p-3 rounded mb-4'>
                                {t('Blocklist entry deleted successfully')}
                                <button onClick={resetDelete} className='float-right'>
                                    ×
                                </button>
                            </div>
                        )}
                        <div className='max-w-3xl'>
                            <Formik
                                validationSchema={schema}
                                onSubmit={async (values, { resetForm }) => {
                                    try {
                                        await addBlocklistEntry({
                                            username: user.username,
                                            blockedUsername: values.blockee
                                        }).unwrap();
                                        resetForm();
                                    } catch (err) {
                                        // Error handled by RTK Query
                                    }
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
                                                It can sometimes become necessary to prevent someone
                                                joining your games, or stop seeing their messages,
                                                or both. Users on this list will not be able to join
                                                your games, and you will not see their chat messages
                                                or their games.
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

                                        <Button color='primary' type='submit' isLoading={isAdding}>
                                            <Trans>Add</Trans>
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
                )}
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
