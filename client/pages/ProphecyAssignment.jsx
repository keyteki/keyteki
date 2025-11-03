import React, { useState, useEffect } from 'react';
import Button from '../Components/HeroUI/Button';
import { Radio, RadioGroup } from '@heroui/react';
import Panel from '../Components/Site/Panel';
import { useTranslation, Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';
import { useSelector, useDispatch } from 'react-redux';
import CardImage from '../Components/GameBoard/CardImage';

import { navigate } from '../redux/slices/navigationSlice';
import { useSaveProphecyAssignmentsMutation } from '../redux/slices/apiSlice';

const ProphecyAssignment = () => {
    const { t } = useTranslation();
    const [selectedProphecyId, setSelectedProphecyId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [zoomCard, setZoomCard] = useState(null);
    const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const dispatch = useDispatch();
    const selectedDeck = useSelector((state) => state.cards?.selectedDeck);
    const [
        saveProphecyAssignments,
        { isLoading: isSaving, isSuccess: saveSuccess, reset: resetSave }
    ] = useSaveProphecyAssignmentsMutation();

    useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => {
                dispatch(navigate('/decks'));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess, dispatch]);

    if (!selectedDeck) {
        return (
            <AlertPanel
                type='warning'
                message={t('This page is not intended to be viewed directly.')}
            />
        );
    }

    // Get all prophecy cards from the deck
    const prophecyCards = selectedDeck.cards.filter((c) => c.card.type === 'prophecy');

    if (prophecyCards.length !== 4) {
        return (
            <AlertPanel
                type='warning'
                message={t(
                    'Prophecy assignment is only needed for decks with exactly 4 prophecy cards.'
                )}
            />
        );
    }

    // First prophecy is fixed, others are selectable
    const firstProphecy = prophecyCards[0];
    const otherProphecies = prophecyCards.slice(1);

    const handleSave = async () => {
        if (!selectedProphecyId) {
            setErrorMessage(t('You must select which prophecy pairs with the first one.'));
            return;
        }

        // Create the assignment data
        const assignments = {};

        // Find the selected prophecy card
        const selectedProphecy = prophecyCards.find((c) => c.card.id === selectedProphecyId);
        const remainingProphecies = prophecyCards.filter(
            (c) => c.card.id !== firstProphecy.card.id && c.card.id !== selectedProphecyId
        );

        // Assign prophecyId 1 to first prophecy and selected prophecy
        assignments[firstProphecy.dbId] = 1;
        if (selectedProphecy) {
            assignments[selectedProphecy.dbId] = 1;
        }

        // Assign prophecyId 2 to the remaining two prophecies
        if (remainingProphecies[0]) {
            assignments[remainingProphecies[0].dbId] = 2;
        }
        if (remainingProphecies[1]) {
            assignments[remainingProphecies[1].dbId] = 2;
        }

        setErrorMessage('');

        // Save the prophecy assignments
        try {
            await saveProphecyAssignments({ deck: selectedDeck, assignments }).unwrap();
        } catch (err) {
            // Error will be shown via toastr if present
        }
    };

    const handleCardHover = (card, event) => {
        setZoomCard(card);
        let y = event.clientY;
        let yPlusHeight = y + 420;

        if (yPlusHeight >= window.innerHeight) {
            y -= yPlusHeight - window.innerHeight;
        }

        setMousePosition({ x: event.clientX, y: y });
    };

    const handleCardMouseOut = () => {
        setZoomCard(null);
    };

    return (
        <div className='max-w-6xl mx-auto min-h-full'>
            <Panel title={`${t('Assign Prophecy Cards')} - ${selectedDeck.name}`}>
                {saveSuccess && (
                    <AlertPanel
                        type='success'
                        title=''
                        message={t('Prophecy assignments saved successfully')}
                        onClose={resetSave}
                    >
                        {null}
                    </AlertPanel>
                )}
                <AlertPanel title='' message=''>
                    <Trans i18nKey='prophecyAssignment.alert'>
                        Your deck contains prophecy cards. Prophecy cards are double-sided, with
                        different prophecies on each physical card. Please select which prophecy is
                        paired with the first prophecy on the same physical card.
                    </Trans>
                </AlertPanel>
                {errorMessage && (
                    <AlertPanel type='danger' title='' message={errorMessage}>
                        {null}
                    </AlertPanel>
                )}

                {zoomCard && (
                    <div
                        className='fixed top-0 left-0 z-50 w-96'
                        style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                    >
                        <CardImage card={Object.assign({}, zoomCard)} />
                    </div>
                )}

                <div>
                    <h4>
                        <Trans>First Prophecy Card:</Trans>
                    </h4>
                    <div className='text-lg mb-4 p-2 bg-blue-500/10 rounded'>
                        <strong
                            className='cursor-pointer text-blue-600 hover:text-blue-700 hover:underline'
                            onMouseOver={(event) => handleCardHover(firstProphecy.card, event)}
                            onMouseMove={(event) => handleCardHover(firstProphecy.card, event)}
                            onMouseOut={handleCardMouseOut}
                        >
                            {firstProphecy.card.name}
                        </strong>
                    </div>

                    <h5 className='mt-4'>
                        <Trans>Select which prophecy is on the same physical card:</Trans>
                    </h5>

                    <RadioGroup
                        value={selectedProphecyId}
                        onValueChange={setSelectedProphecyId}
                        className='gap-2'
                    >
                        {otherProphecies.map((prophecy) => (
                            <Radio key={prophecy.card.id} value={prophecy.card.id} className='mb-2'>
                                <span
                                    className='cursor-pointer text-blue-600 hover:text-blue-700 hover:underline'
                                    onMouseOver={(event) => handleCardHover(prophecy.card, event)}
                                    onMouseMove={(event) => handleCardHover(prophecy.card, event)}
                                    onMouseOut={handleCardMouseOut}
                                >
                                    {prophecy.card.name}
                                </span>
                            </Radio>
                        ))}
                    </RadioGroup>

                    {selectedProphecyId && (
                        <div className='mt-4'>
                            <AlertPanel type='info'>
                                <Trans i18nKey='prophecyAssignment.selectedPairing'>
                                    You have selected{' '}
                                    <strong>
                                        <span
                                            className='cursor-pointer text-blue-600 hover:text-blue-700 hover:underline'
                                            onMouseOver={(event) =>
                                                handleCardHover(firstProphecy.card, event)
                                            }
                                            onMouseMove={(event) =>
                                                handleCardHover(firstProphecy.card, event)
                                            }
                                            onMouseOut={handleCardMouseOut}
                                        >
                                            {firstProphecy.card.name}
                                        </span>
                                    </strong>{' '}
                                    and{' '}
                                    <strong>
                                        <span
                                            className='cursor-pointer text-blue-600 hover:text-blue-700 hover:underline'
                                            onMouseOver={(event) =>
                                                handleCardHover(
                                                    otherProphecies.find(
                                                        (p) => p.card.id === selectedProphecyId
                                                    )?.card,
                                                    event
                                                )
                                            }
                                            onMouseMove={(event) =>
                                                handleCardHover(
                                                    otherProphecies.find(
                                                        (p) => p.card.id === selectedProphecyId
                                                    )?.card,
                                                    event
                                                )
                                            }
                                            onMouseOut={handleCardMouseOut}
                                        >
                                            {
                                                otherProphecies.find(
                                                    (p) => p.card.id === selectedProphecyId
                                                )?.card.name
                                            }
                                        </span>
                                    </strong>{' '}
                                    to be on the same physical card. The remaining two prophecies
                                    will be paired together on the second card.
                                </Trans>
                            </AlertPanel>
                        </div>
                    )}
                </div>

                <div className='text-center mt-4'>
                    <Button
                        color='primary'
                        onPress={handleSave}
                        isDisabled={!selectedProphecyId || isSaving}
                    >
                        <Trans>Save Prophecy Assignments</Trans>
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

export default ProphecyAssignment;
