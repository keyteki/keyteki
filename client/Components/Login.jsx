import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@heroui/react';
import Button from '../Components/HeroUI/Button';
import { Formik } from 'formik';
import * as yup from 'yup';

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
                    className='flex flex-col gap-4 max-w-2xl mx-auto'
                >
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        <Input
                            name='username'
                            type='text'
                            label={t('Username')}
                            placeholder={t('Enter your username')}
                            value={formProps.values.username}
                            onChange={formProps.handleChange}
                            onBlur={formProps.handleBlur}
                            isInvalid={formProps.touched.username && !!formProps.errors.username}
                            errorMessage={formProps.errors.username}
                            variant='bordered'
                            labelPlacement='outside'
                        />
                        <Input
                            name='password'
                            type='password'
                            label={t('Password')}
                            placeholder={t('Enter your password')}
                            value={formProps.values.password}
                            onChange={formProps.handleChange}
                            onBlur={formProps.handleBlur}
                            isInvalid={formProps.touched.password && !!formProps.errors.password}
                            errorMessage={formProps.errors.password}
                            variant='bordered'
                            labelPlacement='outside'
                        />
                    </div>

                    <Link href='/forgot' className='text-sm text-primary hover:underline'>
                        {String(t('Forgotten your password?'))}
                    </Link>

                    <div className='text-center mt-4'>
                        <Button color='primary' type='submit' size='md'>
                            {t('Login')}
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default Login;
