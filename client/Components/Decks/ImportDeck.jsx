import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

import ApiStatus from '../Site/ApiStatus';
import Panel from '../Site/Panel';
import { useSaveDeckMutation } from '../../redux/api';

const ImportDeck = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [saveDeck, saveDeckState] = useSaveDeckMutation();
    useEffect(() => {
        if (saveDeckState.isSuccess) {
            const timeoutId = setTimeout(() => {
                saveDeckState.reset();
                navigate('/decks');
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [navigate, saveDeckState]);

    const apiState = saveDeckState.isUninitialized
        ? null
        : {
              loading: saveDeckState.isLoading,
              success: saveDeckState.isSuccess,
              message: saveDeckState.isSuccess
                  ? t('Deck added successfully')
                  : saveDeckState.error?.data?.message
          };

    const schema = yup.object({
        deckLink: yup
            .string()
            .required(t('You must specify the deck link'))
            .notOneOf(
                ['https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000'],
                t('The URL you entered is invalid.  Please check it and try again.')
            )
            .matches(
                /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                t('The URL you entered is invalid.  Please check it and try again.')
            )
    });

    const initialValues = {
        deckLink: ''
    };

    const onSubmit = (values) => {
        const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        let uuid = values.deckLink.match(regex);

        saveDeck({ uuid: uuid[0] });
    };

    return (
        <div>
            <Col md={{ span: 8, offset: 2 }} className='profile full-height'>
                <ApiStatus state={apiState} onClose={() => saveDeckState.reset()} />
                <Panel title={t('Import Deck')}>
                    <Trans i18nKey='importdeck.enterlink'>
                        <p>
                            Enter the deck link from the&nbsp;
                            <a
                                href='https://keyforgegame.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                keyforge website.
                            </a>
                        </p>
                        <p>
                            Either search for a deck, or find one from the &quot;My Decks&quot;
                            section of the website. Find the URL of the deck and paste it in to the
                            box below.
                        </p>
                        <p>The URL looks like this: </p>
                    </Trans>
                    <p>
                        <code>
                            https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000
                        </code>
                    </p>
                    <Formik
                        validationSchema={schema}
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                    >
                        {(formProps) => (
                            <Form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    formProps.handleSubmit(event);
                                }}
                            >
                                <Row>
                                    <Form.Group as={Col} xs='9' controlId='formGridDeckLink'>
                                        <Form.Label>{t('Deck Link')}</Form.Label>
                                        <Form.Control
                                            name='deckLink'
                                            type='text'
                                            placeholder={t('Enter the deck link')}
                                            value={formProps.values.deckLink}
                                            onChange={formProps.handleChange}
                                            onBlur={formProps.handleBlur}
                                            isInvalid={
                                                formProps.touched.deckLink &&
                                                !!formProps.errors.deckLink
                                            }
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.deckLink}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Col className='text-center'>
                                    <Button variant='secondary' type='submit'>
                                        {t('Import')}
                                        &nbsp;
                                        {saveDeckState.isLoading && (
                                            <FontAwesomeIcon icon={faCircleNotch} spin />
                                        )}
                                    </Button>
                                </Col>
                            </Form>
                        )}
                    </Formik>
                </Panel>
            </Col>
        </div>
    );
};

ImportDeck.displayName = 'ImportDeck';

export default ImportDeck;
