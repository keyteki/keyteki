import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

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
                <Form
                    onSubmit={(event) => {
                        event.preventDefault();
                        formProps.handleSubmit(event);
                    }}
                >
                    <Form.Row>
                        <Form.Group as={Col} lg='6' controlId='formGridUsername'>
                            <Form.Label>{t('Username')}</Form.Label>
                            <Form.Control
                                name='username'
                                type='text'
                                placeholder={t('Enter your username')}
                                value={formProps.values.username}
                                onChange={formProps.handleChange}
                                onBlur={formProps.handleBlur}
                                isInvalid={
                                    formProps.touched.username && !!formProps.errors.username
                                }
                            />
                            <Form.Control.Feedback type='invalid'>
                                {formProps.errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId='formGridPassword'>
                            <Form.Label>{t('Password')}</Form.Label>
                            <Form.Control
                                name='password'
                                type='password'
                                placeholder={t('Enter your password')}
                                value={formProps.values.password}
                                onChange={formProps.handleChange}
                                onBlur={formProps.handleBlur}
                                isInvalid={
                                    formProps.touched.password && !!formProps.errors.password
                                }
                            />
                            <Form.Control.Feedback type='invalid'>
                                {formProps.errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>

                    <div className='text-center'>
                        <Button variant='primary' type='submit'>
                            {t('Login')}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default Login;
