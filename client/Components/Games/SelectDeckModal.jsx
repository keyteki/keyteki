import React from 'react';
import { Modal as HeroModal } from '@heroui/react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import DeckList from '../Decks/DeckList.jsx';
import { Constants } from '../../constants.js';

import './SelectDeckModal.scss';

const SelectDeckModal = ({
    deckFilter,
    onClose,
    onDeckSelected,
    expansions = Constants.Expansions
}) => {
    const standaloneDecks = useSelector((state) => state.cards.standaloneDecks);
    const { t } = useTranslation();

    return (
        <HeroModal.Backdrop isOpen onOpenChange={onClose}>
            <HeroModal.Container placement='center'>
                <HeroModal.Dialog className='sm:max-w-5xl'>
                    <HeroModal.CloseTrigger />
                    <HeroModal.Header>
                        <HeroModal.Heading>{t('Select Deck')}</HeroModal.Heading>
                    </HeroModal.Header>
                    <HeroModal.Body>
                        <DeckList
                            deckFilter={deckFilter}
                            onDeckSelected={onDeckSelected}
                            expansions={expansions}
                        />
                        {standaloneDecks && standaloneDecks.length !== 0 ? (
                            <div>
                                <h4 className='deck-list-header'>
                                    <Trans>Or choose a standalone deck</Trans>:
                                </h4>
                                <DeckList standaloneDecks onDeckSelected={onDeckSelected} />
                            </div>
                        ) : null}
                    </HeroModal.Body>
                </HeroModal.Dialog>
            </HeroModal.Container>
        </HeroModal.Backdrop>
    );
};

SelectDeckModal.displayName = 'SelectDeckModal';

export default SelectDeckModal;
