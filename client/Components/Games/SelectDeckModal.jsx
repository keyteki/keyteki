import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';

import DeckList from '../Decks/DeckList.jsx';
import { Constants } from '../../constants.js';

const SelectDeckModal = ({
    deckFilter,
    onClose,
    onDeckSelected,
    expansions = Constants.Expansions
}) => {
    const standaloneDecks = useSelector((state) => state.cards.standaloneDecks);
    const { t } = useTranslation();

    return (
        <Modal isOpen={true} onClose={onClose} size='5xl' scrollBehavior='inside'>
            <ModalContent>
                <ModalHeader>{t('Select Deck')}</ModalHeader>
                <ModalBody>
                    <div>
                        <DeckList
                            deckFilter={deckFilter}
                            onDeckSelected={onDeckSelected}
                            expansions={expansions}
                        />
                        {standaloneDecks && standaloneDecks.length !== 0 && (
                            <div>
                                <h4 className='deck-list-header'>
                                    <Trans>Or choose a standalone deck</Trans>:
                                </h4>
                                <DeckList standaloneDecks onDeckSelected={onDeckSelected} />
                            </div>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

SelectDeckModal.displayName = 'SelectDeckModal';

export default SelectDeckModal;
