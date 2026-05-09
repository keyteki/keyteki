import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Input, Label } from '@heroui/react';
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
                    className='space-y-3'
                >
                    <div>
                        <Label className='sr-only' htmlFor='username'>
                            {t('Username')}
                        </Label>
                        <Input
                            id='username'
                            name='username'
                            type='text'
                            placeholder={t('Username')}
                            value={formProps.values.username}
                            onChange={formProps.handleChange}
                            onBlur={formProps.handleBlur}
                            variant='tertiary'
                            className='w-full'
                        />
                        {formProps.touched.username && formProps.errors.username ? (
                            <div className='mt-1 text-sm text-red-300'>
                                {formProps.errors.username}
                            </div>
                        ) : null}
                    </div>
                    <div>
                        <Label className='sr-only' htmlFor='password'>
                            {t('Password')}
                        </Label>
                        <Input
                            id='password'
                            name='password'
                            type='password'
                            placeholder={t('Password')}
                            value={formProps.values.password}
                            onChange={formProps.handleChange}
                            onBlur={formProps.handleBlur}
                            variant='tertiary'
                            className='w-full'
                        />
                        {formProps.touched.password && formProps.errors.password ? (
                            <div className='mt-1 text-sm text-red-300'>
                                {formProps.errors.password}
                            </div>
                        ) : null}
                    </div>

                    <Link href='/forgot' className='block text-link hover:text-accent'>
                        <Trans>Forgotten your password?</Trans>
                    </Link>

                    <div className='pt-1'>
                        <Button type='submit' variant='primary'>
                            {t('Login')}
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default Login;
