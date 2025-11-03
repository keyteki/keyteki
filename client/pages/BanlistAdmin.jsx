import React, { useCallback } from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Input } from '@heroui/react';
import Button from '../Components/HeroUI/Button';
import Panel from '../Components/Site/Panel';
import AlertPanel from '../Components/Site/AlertPanel';
import {
    useLoadBanlistQuery,
    useAddBanlistMutation,
    useDeleteBanlistMutation
} from '../redux/slices/apiSlice';

const BanlistAdmin = () => {
    const { data: banlist = [], isLoading, error } = useLoadBanlistQuery(undefined);
    const [
        addBanlist,
        { isLoading: isAdding, isSuccess: addSuccess, reset: resetAdd }
    ] = useAddBanlistMutation();
    const [
        deleteBanlist,
        { isLoading: isDeleting, isSuccess: deleteSuccess, reset: resetDelete }
    ] = useDeleteBanlistMutation();

    const onAddBanlistClick = useCallback(
        async (state) => {
            try {
                await addBanlist({ ip: state.ip }).unwrap();
            } catch (err) {
                // Error handled by RTK Query
            }
        },
        [addBanlist]
    );

    const onDeleteClick = useCallback(
        async (id) => {
            try {
                await deleteBanlist(id).unwrap();
            } catch (err) {
                // Error handled by RTK Query
            }
        },
        [deleteBanlist]
    );

    if (isLoading) {
        return 'Loading banlist, please wait...';
    }

    if (error) {
        return (
            <AlertPanel
                type='error'
                message={`Error loading banlist: ${error.message || 'Unknown error'}`}
            />
        );
    }

    let renderedBanlist = banlist.map((entry) => {
        return (
            <tr key={entry.id}>
                <td>{entry.ip}</td>
                <td>{moment(entry.added).format('YYYY-MM-DD')}</td>
                <td>{entry.user}</td>
                <td>
                    <Button
                        color='danger'
                        onPress={() => onDeleteClick(entry.id)}
                        isLoading={isDeleting}
                    >
                        Delete
                    </Button>
                </td>
            </tr>
        );
    });

    return (
        <div className='flex flex-col gap-4'>
            {addSuccess && (
                <AlertPanel
                    type='success'
                    message='Banlist item added successfully.'
                    onClose={resetAdd}
                />
            )}
            {deleteSuccess && (
                <AlertPanel
                    type='success'
                    message='Banlist item deleted successfully.'
                    onClose={resetDelete}
                />
            )}
            <Panel title='Banlist administration'>
                <table className='table table-striped w-full'>
                    <thead>
                        <tr>
                            <th className='w-1/4'>Ip</th>
                            <th className='w-1/4'>Added</th>
                            <th className='w-1/3'>Added By</th>
                            <th className='w-1/6'>Action</th>
                        </tr>
                    </thead>
                    <tbody>{renderedBanlist}</tbody>
                </table>
            </Panel>
            <Panel title='Add new ip'>
                <Formik
                    initialValues={{ ip: '' }}
                    validationSchema={yup.object({ ip: yup.string().required('IP is required') })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            await onAddBanlistClick({ ip: values.ip });
                            resetForm();
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {(form) => (
                        <form
                            className='flex items-end gap-4'
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(e);
                            }}
                        >
                            <div className='flex-1'>
                                <Input
                                    label='IP Address'
                                    name='ip'
                                    value={form.values.ip}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    isInvalid={form.touched.ip && !!form.errors.ip}
                                    errorMessage={form.errors.ip}
                                />
                            </div>
                            <div>
                                <Button color='primary' type='submit' isLoading={isAdding}>
                                    Add
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Panel>
        </div>
    );
};

BanlistAdmin.displayName = 'BanlistAdmin';

export default BanlistAdmin;
