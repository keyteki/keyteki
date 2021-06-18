import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useTranslation } from 'react-i18next';
import { Account } from '../redux/types';
import { clearApiStatus, forgotPassword } from '../redux/actions';
import { Form, Col, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import ApiStatus from '../Components/Site/ApiStatus';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Account.ForgotPasswordRequest];

        if (retState && retState.success) {
            retState.message = t(
                'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
            );

            setTimeout(() => {
                dispatch(clearApiStatus(Account.ForgotPasswordRequest));
            }, 3000);
        }

        return retState;
    });

    const initialValues = {
        username: '',
        captchaValue: ''
    };

    const schema = yup.object({
        username: yup.string().required(t('You must enter your username or email address.')),
        captchaValue: yup.string().required(t('You must complete the captcha.')).nullable()
    });

    return (
        <Col sm={{ span: 6, offset: 3 }}>
            <Panel title={t('Forgot password')}>
                {!apiState && (
                    <AlertPanel
                        type='info'
                        message={t(
                            'To start the password recovery process, please enter your username or email address and click the submit button.'
                        )}
                    />
                )}
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Account.ForgotPasswordRequest))}
                />
                <Formik
                    validationSchema={schema}
                    onSubmit={(values) => {
                        dispatch(
                            forgotPassword({
                                username: values.username,
                                captcha: values.captchaValue
                            })
                        );
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
                            <Form.Row>
                                <Form.Group as={Col} sm='8' controlId='formGridUsername'>
                                    <Form.Label>{t('Username')}</Form.Label>
                                    <Form.Control
                                        name='username'
                                        type='text'
                                        placeholder={t('Enter your username or email address')}
                                        value={formProps.values.username}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.username &&
                                            !!formProps.errors.username
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} sm={8}>
                                    <ReCAPTCHA
                                        className='is-invalid'
                                        sitekey='6LdMGfYUAAAAAJN_sqZOBPn0URaFkWQ1QXvQqBbj'
                                        theme='dark'
                                        onChange={(value) =>
                                            formProps.setFieldValue('captchaValue', value, true)
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.captchaValue}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <div className='text-center'>
                                <Button variant='primary' type='submit'>
                                    {t('Submit')}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Panel>
        </Col>
    );
};

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
