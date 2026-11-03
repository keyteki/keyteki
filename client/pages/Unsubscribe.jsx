import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useUnsubscribeMutation } from '../redux/api';

/**
 * @typedef UnsubscribeProps
 * @property {string} [id]
 * @property {string} [token]
 */

/**
 * Reached from the link in an email. Asks before unsubscribing, as link checkers open links in emails.
 * @param {UnsubscribeProps} props
 */
const Unsubscribe = ({ id, token }) => {
    const { t } = useTranslation();
    const [unsubscribe, { isLoading, isSuccess, error }] = useUnsubscribeMutation();

    let content;
    if (!id || !token) {
        content = <AlertPanel type='danger' message={t('This unsubscribe link is not valid')} />;
    } else if (isSuccess) {
        content = (
            <AlertPanel
                type='success'
                message={t(
                    "You won't get any more emails like this. You can turn them back on in your profile."
                )}
            />
        );
    } else {
        content = (
            <div className='flex flex-col items-center gap-3 py-2 text-center'>
                {error && (
                    <AlertPanel
                        type='danger'
                        message={
                            error.data?.message || t('Something went wrong. Please try again.')
                        }
                    />
                )}
                <p className='m-0'>
                    {t(
                        'Stop occasional emails, such as your yearly Wrapped? Emails about your account, like password resets, will still be sent.'
                    )}
                </p>
                <Button
                    isDisabled={isLoading}
                    variant='primary'
                    onPress={() => unsubscribe({ id, token })}
                >
                    {t('Stop these emails')}
                </Button>
            </div>
        );
    }

    return (
        <div className='mx-auto w-full max-w-xl'>
            <Panel title={t('Unsubscribe')} contentClassName='px-4 py-4'>
                {content}
            </Panel>
        </div>
    );
};

export default Unsubscribe;
