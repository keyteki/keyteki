import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation, Trans } from 'react-i18next';

import Link from '../Components/Navigation/Link';

/**
 * @typedef LoginDetails
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef LoginProps
 * @property {function(LoginDetails): void} onSubmit Called when the form is submitted
 */

/**
 * @type {LoginDetails}
 */
const initialValues = {
    username: '',
    password: ''
};

/**
 * @param {LoginProps} props
 */
const Login = (props) => {
    const { t } = useTranslation();

    const schema = yup.object({
        username: yup.string().required(t('You must specify a username')),
        password: yup.string().required(t('You must specify a password'))
    });

    return (
        <Formik validationSchema={schema} onSubmit={props.onSubmit} initialValues={initialValues}>
            {(formProps) => (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        formProps.handleSubmit(event);
                    }}
                >
                    <div className='grid gap-3 lg:grid-cols-2'>
                        <div>
                            <label className='mb-1 block text-sm text-zinc-200' htmlFor='username'>
                                {t('Username')}
                            </label>
                            <input
                                id='username'
                                name='username'
                                type='text'
                                placeholder={t('Enter your username')}
                                value={formProps.values.username}
                                onChange={formProps.handleChange}
                                onBlur={formProps.handleBlur}
                                className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                            />
                            {formProps.touched.username && formProps.errors.username ? (
                                <div className='mt-1 text-xs text-red-300'>
                                    {formProps.errors.username}
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <label className='mb-1 block text-sm text-zinc-200' htmlFor='password'>
                                {t('Password')}
                            </label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                placeholder={t('Enter your password')}
                                value={formProps.values.password}
                                onChange={formProps.handleChange}
                                onBlur={formProps.handleBlur}
                                className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                            />
                            {formProps.touched.password && formProps.errors.password ? (
                                <div className='mt-1 text-xs text-red-300'>
                                    {formProps.errors.password}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <Link href='/forgot'>
                        <Trans>Forgotten your password?</Trans>
                    </Link>

                    <div className='mt-3 text-center'>
                        <button
                            type='submit'
                            className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                        >
                            {t('Login')}
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default Login;
