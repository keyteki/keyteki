import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../Components/HeroUI/Button';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import AlertPanel from '../Components/Site/AlertPanel';
import { useDeleteDeckMutation } from '../redux/slices/apiSlice';
import Page from './Page';

const DecksComponent = () => {
    const { t } = useTranslation();
    const [, { isSuccess: deleteSuccess, reset: resetDelete }] = useDeleteDeckMutation({
        fixedCacheKey: 'delete-deck'
    });

    return (
        <Page>
            <div className='w-full'>
                {deleteSuccess && (
                    <AlertPanel
                        type='success'
                        title=''
                        message={t('Deck deleted successfully')}
                        onClose={resetDelete}
                    >
                        {null}
                    </AlertPanel>
                )}
            </div>
            <Panel title={t('Your decks')}>
                <div className='text-center mb-4'>
                    <Link href='/decks/import'>
                        <Button color='primary'>
                            <Trans>Import Deck</Trans>
                        </Button>
                    </Link>
                    <Link href='/decks/alliance' className='ml-2'>
                        <Button color='primary'>
                            <Trans>Build Alliance Deck</Trans>
                        </Button>
                    </Link>
                </div>
                <DeckList mode='accordion' />
            </Panel>
        </Page>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
