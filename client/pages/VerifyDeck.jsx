import React, { useRef } from 'react';
import { Col, Row, Button, Form } from 'react-bootstrap';
import { useTranslation, Trans } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { navigate, uploadVerificationImages, clearApiStatus } from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { sortBy } from '../../server/Array';
import { toBase64 } from '../util';
import { useState } from 'react';
import { Decks } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';

import './VerifyDeck.scss';

const VerifyDeck = () => {
    const { t } = useTranslation();
    const selectedDeck = useSelector((state) => state.cards.selectedDeck);
    const dispatch = useDispatch();
    const [cardImages, setCardImages] = useState({});
    const references = useRef({});
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.UploadImages];

        if (retState && retState.success) {
            retState.message = t('Images uploaded successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.UploadImages));
                //dispatch(navigate('/decks/enhancements'));
            }, 3000);
        }

        return retState;
    });

    if (!selectedDeck) {
        setTimeout(() => {
            dispatch(navigate('/decks'));
        }, 5000);

        return (
            <AlertPanel
                type='warning'
                message={t('This page is not intended to be viewed directly.')}
            ></AlertPanel>
        );
    }

    let cards = sortBy(
        sortBy(
            selectedDeck.cards.filter((c) => c.enhancements),
            (c) => c.card.id
        ),
        (c) => c.card.house
    );

    const initialValues = {};
    const schemaObj = {};

    for (let card of cards) {
        schemaObj[card.dbId] = yup
            .mixed()
            // .required(t('You must upload an image for this card'))
            .test(
                'fileSize',
                t('Image must be less than 10MB in size'),
                (value) => !value || value.size <= 5 * 1024 * 1024
            )
            .test(
                'fileType',
                t('Unsupported image format'),
                (value) =>
                    !value ||
                    !value.type ||
                    ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)
            );
    }

    const schema = yup.object(schemaObj);

    return (
        <Formik
            validationSchema={schema}
            onSubmit={async (values) => {
                let base64Images = {};

                for (let [key, value] of Object.entries(values)) {
                    base64Images[key] = await toBase64(value);
                }

                dispatch(uploadVerificationImages(selectedDeck, base64Images));
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
                    <Col md={{ span: 10, offset: 1 }}>
                        <Panel title={`${t('Verify deck')} - ${selectedDeck.name}`}>
                            <AlertPanel>
                                <Trans>
                                    To verify your deck, please upload pictures of each card that
                                    has enhancements on it by clicking on the empty boxes below.
                                    When you are done, click the submit button.
                                </Trans>
                            </AlertPanel>
                            <ApiStatus
                                state={apiState}
                                onClose={() => dispatch(clearApiStatus(Decks.UploadImages))}
                            />
                            <Row>
                                <Form.Group as={Col} md='3'>
                                    <Form.Label>
                                        <Trans>Identity Card</Trans>
                                    </Form.Label>
                                    <div>
                                        {/*!formProps.errors[card.dbId] &&
                                                        cardImages[card.dbId] && (
                                                            <img
                                                                className='verify-image'
                                                                src={cardImages[card.dbId]}
                                                                alt={card.card.name}
                                                            />
                                                        )*/}
                                        <img
                                            className='img-fluid verify-image'
                                            src={cardImages['id-card']}
                                            onClick={() => references.current['id-card']?.click()}
                                        />
                                    </div>
                                    <Form.Control
                                        name='id-card'
                                        type='file'
                                        accept='image/*'
                                        onChange={(event) => {
                                            if (
                                                !event.currentTarget ||
                                                !event.currentTarget.files ||
                                                event.currentTarget.files.length === 0
                                            ) {
                                                return;
                                            }

                                            const file = event.currentTarget.files[0];
                                            cardImages['id-card'] = URL.createObjectURL(file);
                                            setCardImages(Object.assign({}, cardImages));
                                            formProps.setFieldValue('id-card', file);
                                        }}
                                        onBlur={formProps.handleBlur}
                                        hidden
                                        ref={(element) => (references.current['id-card'] = element)}
                                        isInvalid={!!formProps.errors['id-card']}
                                    ></Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors['id-card']}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {cards.map((card) => {
                                    return (
                                        <>
                                            <Form.Group as={Col} md='3'>
                                                <Form.Label>{card.card.name}</Form.Label>
                                                <div>
                                                    {/*!formProps.errors[card.dbId] &&
                                                        cardImages[card.dbId] && (
                                                            <img
                                                                className='verify-image'
                                                                src={cardImages[card.dbId]}
                                                                alt={card.card.name}
                                                            />
                                                        )*/}
                                                    <img
                                                        className='img-fluid verify-image'
                                                        src={cardImages[card.dbId]}
                                                        onClick={() =>
                                                            references.current[card.dbId]?.click()
                                                        }
                                                    />
                                                </div>
                                                <Form.Control
                                                    name={card.dbId}
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={(event) => {
                                                        if (
                                                            !event.currentTarget ||
                                                            !event.currentTarget.files ||
                                                            event.currentTarget.files.length === 0
                                                        ) {
                                                            return;
                                                        }

                                                        const file = event.currentTarget.files[0];
                                                        cardImages[card.dbId] = URL.createObjectURL(
                                                            file
                                                        );
                                                        setCardImages(
                                                            Object.assign({}, cardImages)
                                                        );
                                                        formProps.setFieldValue(card.dbId, file);
                                                    }}
                                                    onBlur={formProps.handleBlur}
                                                    hidden
                                                    ref={(element) =>
                                                        (references.current[card.dbId] = element)
                                                    }
                                                    isInvalid={!!formProps.errors[card.dbId]}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {formProps.errors[card.dbId]}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </>
                                    );
                                })}
                            </Row>
                            <Row>
                                <Col className='text-center pt-4'>
                                    <Button type='submit'>
                                        <Trans>Submit</Trans>
                                        &nbsp;
                                        {apiState && apiState.loading && (
                                            <FontAwesomeIcon icon={faCircleNotch} spin />
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                </Form>
            )}
        </Formik>
    );
};

export default VerifyDeck;
