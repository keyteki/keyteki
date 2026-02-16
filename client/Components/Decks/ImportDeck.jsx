import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Input } from '@heroui/react';

import ApiStatus from '../Site/ApiStatus';
import { useSaveDeckMutation } from '../../redux/api';

const ImportDeck = ({ onClose }) => {
    const { t } = useTranslation();
    const [saveDeck, saveDeckState] = useSaveDeckMutation();

    useEffect(() => {
        if (saveDeckState.isSuccess) {
            onClose?.();
            saveDeckState.reset();
        }
    }, [onClose, saveDeckState]);

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
        const uuid = values.deckLink.match(regex);

        saveDeck({ uuid: uuid[0] });
    };

    return (
        <div className='space-y-5'>
            <div className='mx-auto w-full max-w-[56rem]'>
                <ApiStatus state={apiState} onClose={() => saveDeckState.reset()} />
            </div>
            <div className='mx-auto w-full max-w-[56rem] space-y-4'>
                <div className='space-y-2 text-sm leading-relaxed text-muted'>
                    <Trans i18nKey='importdeck.enterlink'>
                        <p>
                            Enter the deck link from the&nbsp;
                            <a
                                className='text-primary hover:text-primary/80'
                                href='https://keyforgegame.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                keyforge website.
                            </a>
                        </p>
                        <p>
                            Either search for a deck, or find one from the &quot;My Decks&quot;
                            section of the website. Find the URL of the deck and paste it into the
                            box below.
                        </p>
                        <p>The URL looks like this:</p>
                    </Trans>
                    <div className='overflow-x-auto rounded-md border border-border/70 bg-surface-secondary/60 px-3 py-2 font-mono text-xs text-foreground'>
                        https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000
                    </div>
                </div>
                <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={initialValues}>
                    {(formProps) => (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                formProps.handleSubmit(event);
                            }}
                        >
                            <div className='w-full'>
                                <label
                                    className='mb-1 block text-sm text-zinc-200'
                                    htmlFor='deckLink'
                                >
                                    {t('Deck Link')}
                                </label>
                                <Input
                                    fullWidth
                                    className='w-full'
                                    id='deckLink'
                                    name='deckLink'
                                    placeholder={t('Enter the deck link')}
                                    type='text'
                                    value={formProps.values.deckLink}
                                    variant='tertiary'
                                    onBlur={formProps.handleBlur}
                                    onChange={formProps.handleChange}
                                />
                                {formProps.touched.deckLink && formProps.errors.deckLink ? (
                                    <div className='mt-1 text-xs text-red-300'>
                                        {formProps.errors.deckLink}
                                    </div>
                                ) : null}
                            </div>

                            <div className='mt-4 flex justify-end'>
                                <Button
                                    type='submit'
                                    variant='tertiary'
                                    isPending={saveDeckState.isLoading}
                                >
                                    {t('Import')}
                                    &nbsp;
                                    {saveDeckState.isLoading ? (
                                        <FontAwesomeIcon icon={faCircleNotch} spin />
                                    ) : null}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

ImportDeck.displayName = 'ImportDeck';

export default ImportDeck;
