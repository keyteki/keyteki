import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import {
    ButtonGroup,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@heroui/react';
import Button from '../HeroUI/Button';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { useDeleteDeckMutation } from '../../redux/slices/apiSlice';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const [deleteDeckMutation] = useDeleteDeckMutation();
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const handleDeleteClick = () => {
        if (deck?.id) {
            deleteDeckMutation(deck.id);
        }
    };

    return (
        <Panel title={deck.name}>
            <div className='w-full text-center'>
                <ButtonGroup>
                    <Button color='danger' onPress={() => setConfirmOpen(true)}>
                        <Trans>Delete</Trans>
                    </Button>
                </ButtonGroup>
            </div>
            <Modal isOpen={isConfirmOpen} onOpenChange={setConfirmOpen} placement='center'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <Trans>Confirm</Trans>
                            </ModalHeader>
                            <ModalBody>
                                <Trans>Are you sure you want to delete this deck?</Trans>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='default' onPress={onClose}>
                                    <Trans>Cancel</Trans>
                                </Button>
                                <Button
                                    color='danger'
                                    onPress={() => {
                                        handleDeleteClick();
                                        onClose();
                                    }}
                                >
                                    <Trans>Delete</Trans>
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <DeckSummary deck={deck} />
        </Panel>
    );
};

export default ViewDeck;
