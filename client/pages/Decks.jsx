import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus } from '../redux/actions';

const DecksComponent = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.DeleteDeck];

        if (retState && retState.success) {
            retState.message = t('Deck deleted successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.DeleteDeck));
            }, 1000);
        }

        return retState;
    });
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));

    return (
        <div className='full-height'>
            <div className='w-full'>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.DeleteDeck))}
                />
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
