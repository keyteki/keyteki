import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';

import DeckList from '../Decks/DeckList.jsx';

import './SelectDeckModal.scss';

const SelectDeckModal = ({ onClose, onDeckSelected }) => {
    const standaloneDecks = useSelector((state) => state.cards.standaloneDecks);
    const { t } = useTranslation();

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Select Deck')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <DeckList onDeckSelected={onDeckSelected} />
                        {standaloneDecks && standaloneDecks.length !== 0 && (
                            <div>
                                <h4 className='deck-list-header'>
                                    <Trans>Or choose a standalone deck</Trans>:
                                </h4>
                                <DeckList standaloneDecks onDeckSelected={onDeckSelected} />
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

SelectDeckModal.displayName = 'SelectDeckModal';

export default SelectDeckModal;
