import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Modal as HeroModal } from '@heroui/react';
import { useSelector } from 'react-redux';
import Icon from '../Icon';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { useDeleteDeckMutation, useRefreshAccoladesMutation } from '../../redux/api';

/**
 * @typedef ViewDeckProps
 * @property {import('./DeckList').Deck} deck The currently selected deck
 */

/**
 * @param {ViewDeckProps} props
 */
const ViewDeck = ({ deck }) => {
    const [deleteDeck] = useDeleteDeckMutation();
    const [refreshAccolades] = useRefreshAccoladesMutation();
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showAccolades = user?.settings?.optionSettings?.showAccolades ?? true;

    const handleDeleteClick = () => {
        deleteDeck(deck.id);
        setIsDeleteModalOpen(false);
    };

    const handleRefreshAccolades = async () => {
        setIsRefreshing(true);
        try {
            await refreshAccolades(deck.id);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <Panel
            className='h-full !mb-0'
            contentClassName='flex h-full min-h-0 flex-col'
            title={deck.name}
            headerVariant='context'
            titleClass='text-sm font-semibold tracking-wide'
        >
            <div className='mb-2 text-center'>
                <div className='inline-flex gap-2'>
                    {showAccolades ? (
                        <Button
                            variant='tertiary'
                            onPress={handleRefreshAccolades}
                            isDisabled={isRefreshing}
                        >
                            <span className='inline-flex items-center gap-2'>
                                <Icon icon={faSync} spin={isRefreshing} />
                                <span>{t('Refresh Accolades')}</span>
                            </span>
                        </Button>
                    ) : null}
                    <Button variant='danger' onPress={() => setIsDeleteModalOpen(true)}>
                        <Trans>Delete</Trans>
                    </Button>
                </div>
            </div>
            <div className='min-h-0 flex-1 overflow-auto pe-1'>
                <DeckSummary deck={deck} />
            </div>
            <HeroModal.Backdrop isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <HeroModal.Container placement='center'>
                    <HeroModal.Dialog className='sm:max-w-md'>
                        <HeroModal.CloseTrigger />
                        <HeroModal.Header>
                            <HeroModal.Heading>{t('Delete Deck')}</HeroModal.Heading>
                        </HeroModal.Header>
                        <HeroModal.Body>
                            <p className='text-sm text-muted'>
                                {t('Are you sure you want to delete this deck?')}
                            </p>
                        </HeroModal.Body>
                        <HeroModal.Footer>
                            <Button variant='tertiary' onPress={() => setIsDeleteModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button variant='danger' onPress={handleDeleteClick}>
                                {t('Delete')}
                            </Button>
                        </HeroModal.Footer>
                    </HeroModal.Dialog>
                </HeroModal.Container>
            </HeroModal.Backdrop>
        </Panel>
    );
};

export default ViewDeck;
