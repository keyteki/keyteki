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

const DecksComponent = () => {
    const { t } = useTranslation();
    const [, { isSuccess: deleteSuccess, reset: resetDelete }] = useDeleteDeckMutation({
        fixedCacheKey: 'delete-deck'
    });
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <div className='full-height'>
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
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='full-height'>
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
                        <DeckList />
                    </Panel>
                </div>
                <div>{selectedDeck && <ViewDeck deck={selectedDeck} />}</div>
            </div>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
