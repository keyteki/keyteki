import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../Components/HeroUI/Button';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import AlertPanel from '../Components/Site/AlertPanel';
import { useDeleteDeckMutation } from '../redux/slices/apiSlice';
import Page from './Page';

const DecksComponent = () => {
    const { t } = useTranslation();
    const [, { isSuccess: deleteSuccess, reset: resetDelete }] = useDeleteDeckMutation({
        fixedCacheKey: 'delete-deck'
    });
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <Page size='large'>
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
            <Panel className='w-1/2' title={t('Your decks')}>
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
                <DeckList />
            </Panel>
            <div>{selectedDeck && <ViewDeck deck={selectedDeck} />}</div>
        </Page>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
