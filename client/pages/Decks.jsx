import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Modal as HeroModal, toast } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import ImportDeck from '../Components/Decks/ImportDeck';
import ApiStatus from '../Components/Site/ApiStatus';
import { useDeleteDecksMutation } from '../redux/api';
import { cardsActions } from '../redux/slices/cardsSlice';

const DecksComponent = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDecks, setSelectedDecks] = useState([]);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDecks] = useDeleteDecksMutation();
    const apiState = useSelector((state) =>
        state.cards.deckDeleted ? { success: true, message: t('Deck deleted successfully') } : null
    );
    const { selectedDeck } = useSelector((state) => ({
        selectedDeck: state.cards.selectedDeck
    }));
    const selectedDeckCount = selectedDecks.length;
    const selectedRowIds = useMemo(
        () => selectedDecks.map((deck) => String(deck.id)),
        [selectedDecks]
    );

    const deleteSelectedDecks = async () => {
        const ids = [...new Set(selectedDecks.map((deck) => deck.id))];
        if (ids.length === 0) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteDecks(ids).unwrap();
            toast.success(
                ids.length === 1
                    ? t('Deck deleted successfully')
                    : t('{{count}} decks deleted successfully', { count: ids.length })
            );
            setShowDeleteModal(false);
            setSelectedDecks([]);
        } catch (error) {
            const message = error?.data?.message || t('Failed to delete selected deck(s).');
            setDeleteError(message);
            toast.danger(message);
        } finally {
            setIsDeleting(false);
        }
    };

    React.useEffect(() => {
        if (apiState?.success) {
            setSelectedDecks([]);
        }
    }, [apiState]);

    return (
        <div className='flex h-auto flex-col lg:h-[calc(100vh-65px)] lg:overflow-hidden'>
            <ApiStatus state={apiState} onClose={() => dispatch(cardsActions.clearDeckStatus())} />
            <div className='grid min-h-0 gap-3 lg:h-full lg:grid-cols-2'>
                <div className='min-h-0'>
                    <Panel
                        className='h-full !mb-0'
                        title={t('Your decks')}
                        headerVariant='context'
                        titleClass='text-sm font-semibold tracking-wide text-foreground'
                    >
                        <DeckList
                            onDeleteDecks={() => setShowDeleteModal(true)}
                            onImportDeck={() => setShowImportModal(true)}
                            onNavigateAllianceDeck={() => navigate('/decks/alliance')}
                            onSelectionChange={(nextDecks) => {
                                setSelectedDecks((currentDecks) => {
                                    const currentIds = currentDecks
                                        .map((deck) => String(deck.id))
                                        .sort();
                                    const nextIds = nextDecks.map((deck) => String(deck.id)).sort();

                                    if (
                                        currentIds.length === nextIds.length &&
                                        currentIds.every((id, index) => id === nextIds[index])
                                    ) {
                                        return currentDecks;
                                    }

                                    return nextDecks;
                                });
                            }}
                            selectedDeckCount={selectedDeckCount}
                            selectedRows={selectedRowIds}
                        />
                    </Panel>
                </div>
                <div className='min-h-0'>
                    {selectedDeck ? <ViewDeck deck={selectedDeck} /> : null}
                </div>
            </div>

            <HeroModal.Backdrop isOpen={showImportModal} onOpenChange={setShowImportModal}>
                <HeroModal.Container placement='center'>
                    <HeroModal.Dialog className='sm:max-w-3xl'>
                        <HeroModal.CloseTrigger />
                        <HeroModal.Header>
                            <HeroModal.Heading>{t('Import Deck')}</HeroModal.Heading>
                        </HeroModal.Header>
                        <HeroModal.Body className='overflow-visible'>
                            <ImportDeck onClose={() => setShowImportModal(false)} />
                        </HeroModal.Body>
                    </HeroModal.Dialog>
                </HeroModal.Container>
            </HeroModal.Backdrop>

            <HeroModal.Backdrop
                isOpen={showDeleteModal}
                onOpenChange={(open) => {
                    setShowDeleteModal(open);
                    if (!open) {
                        setDeleteError(null);
                    }
                }}
            >
                <HeroModal.Container placement='center'>
                    <HeroModal.Dialog className='sm:max-w-lg'>
                        <HeroModal.CloseTrigger />
                        <HeroModal.Header>
                            <HeroModal.Heading>{t('Delete Decks')}</HeroModal.Heading>
                        </HeroModal.Header>
                        <HeroModal.Body className='space-y-3'>
                            <p className='text-sm text-muted'>
                                {selectedDeckCount === 1
                                    ? t('Are you sure you want to delete this deck?')
                                    : t('Are you sure you want to delete {{count}} decks?', {
                                          count: selectedDeckCount
                                      })}
                            </p>
                            {deleteError ? (
                                <ApiStatus
                                    state={{ loading: false, success: false, message: deleteError }}
                                    onClose={() => setDeleteError(null)}
                                />
                            ) : null}
                        </HeroModal.Body>
                        <HeroModal.Footer>
                            <Button
                                variant='secondary'
                                isDisabled={isDeleting}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                {t('Cancel')}
                            </Button>
                            <Button
                                variant='danger'
                                isDisabled={selectedDeckCount === 0}
                                isPending={isDeleting}
                                onPress={deleteSelectedDecks}
                            >
                                {t('Delete')}
                            </Button>
                        </HeroModal.Footer>
                    </HeroModal.Dialog>
                </HeroModal.Container>
            </HeroModal.Backdrop>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
