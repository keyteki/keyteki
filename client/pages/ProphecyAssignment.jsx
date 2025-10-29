import React, { useState } from 'react';
import Button from '../Components/HeroUI/Button';
import { Radio, RadioGroup } from '@heroui/react';
import Panel from '../Components/Site/Panel';
import { useTranslation, Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';
import { useSelector, useDispatch } from 'react-redux';
import CardImage from '../Components/GameBoard/CardImage';

import { navigate, saveProphecyAssignments, clearApiStatus } from '../redux/actions';
import { Decks } from '../redux/types';
import ApiStatus from '../Components/Site/ApiStatus';

import './ProphecyAssignment.scss';

const ProphecyAssignment = () => {
    const { t } = useTranslation();
    const [selectedProphecyId, setSelectedProphecyId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [zoomCard, setZoomCard] = useState(null);
    const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const dispatch = useDispatch();
    const selectedDeck = useSelector((state) => state.cards?.selectedDeck);
    const apiState = useSelector((state) => {
        const retState = state.api?.[Decks.SaveProphecyAssignments];

        if (retState && retState.success) {
            retState.message = t('Prophecy assignments saved successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.SaveProphecyAssignments));
                dispatch(navigate('/decks'));
            }, 3000);
        }

        return retState;
    });

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

    const handleSave = () => {
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
        dispatch(saveProphecyAssignments(selectedDeck, assignments));
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
        <div className='max-w-6xl mx-auto profile full-height'>
            <Panel title={`${t('Assign Prophecy Cards')} - ${selectedDeck.name}`}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Decks.SaveProphecyAssignments))}
                />
                <AlertPanel>
                    <Trans i18nKey='prophecyAssignment.alert'>
                        Your deck contains prophecy cards. Prophecy cards are double-sided, with
                        different prophecies on each physical card. Please select which prophecy is
                        paired with the first prophecy on the same physical card.
                    </Trans>
                </AlertPanel>
                {errorMessage && <AlertPanel type='danger' message={errorMessage} />}

                {zoomCard && (
                    <div
                        className='prophecy-card-zoom'
                        style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                    >
                        <CardImage card={Object.assign({}, zoomCard)} />
                    </div>
                )}

                <div className='prophecy-assignment-form'>
                    <h4>
                        <Trans>First Prophecy Card:</Trans>
                    </h4>
                    <div className='first-prophecy-card'>
                        <strong
                            className='prophecy-card-name'
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
                                    className='prophecy-card-name'
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
                                            className='prophecy-card-name'
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
                                            className='prophecy-card-name'
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
                    <Button color='primary' onPress={handleSave} isDisabled={!selectedProphecyId}>
                        <Trans>Save Prophecy Assignments</Trans>
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

export default ProphecyAssignment;
