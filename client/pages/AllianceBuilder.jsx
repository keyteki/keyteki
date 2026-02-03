import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row, Form, Button } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus, saveAllianceDeck } from '../redux/actions';
import { Constants } from '../constants';
import { loadDecks } from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import DeckSummary from '../Components/Decks/DeckSummary';
import CardImage from '../Components/GameBoard/CardImage';

import './AllianceBuilder.scss';

const AllianceBuilderPage = () => {
    const { i18n, t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.SaveAllianceDeck];

        if (retState && retState.success) {
            retState.message = t('Deck added successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.SaveAllianceDeck));
                navigate('/decks');
            }, 1000);
        }

        return retState;
    });
    const { dbDecks } = useSelector((state) => ({
        dbDecks: state.cards.decks
    }));
    const [selectedExpansion, setSelectedExpansion] = useState();
    const [currentDeck, setCurrentDeck] = useState();
    const [selectedPods, setSelectedPods] = useState([]);
    const [deckName, setDeckName] = useState();
    const [selectedToken, setSelectedToken] = useState();
    const [selectedProphecyDeck, setSelectedProphecyDeck] = useState();
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });

    const renderToken = (deck) => {
        // Only render non-deck token creatures, not prophecy cards
        const tokenCard = deck.cards.find(
            (d) => d.isNonDeck && d.card && d.card.type === 'token creature' && d.id !== 'the-tide'
        );
        if (!tokenCard) {
            return null;
        }
        return (
            <div className='mt-2'>
                <div
                    className={`deck-card-link${tokenCard === selectedToken ? ' selected' : ''}`}
                    onMouseOver={() => setZoomCard(tokenCard.card)}
                    onMouseMove={(event) => {
                        let y = event.clientY;
                        let yPlusHeight = y + 420;
                        if (yPlusHeight >= window.innerHeight) {
                            y -= yPlusHeight - window.innerHeight;
                        }
                        setMousePosition({ x: event.clientX, y: y });
                    }}
                    onMouseOut={() => setZoomCard(null)}
                    onClick={() => setSelectedToken(tokenCard)}
                >
                    {tokenCard.card.locale && tokenCard.card.locale[i18n.language]
                        ? tokenCard.card.locale[i18n.language].name
                        : tokenCard.card.name}
                </div>
            </div>
        );
    };

    const isSaveDisabled = () => {
        const selectedDecks = selectedPods.map((key) => decksByUuid[key.split(':')[0]]);
        // Only require a token if a non-deck token creature is present (not a prophecy)
        const needsToken = selectedDecks.some((d) =>
            d.cards.some(
                (c) =>
                    c.isNonDeck && c.card && c.card.type === 'token creature' && c.id !== 'the-tide'
            )
        );
        // Check if any selected deck has prophecy cards
        const hasProphecyCards = selectedDecks.some((d) =>
            d.cards.some((c) => (c.card && c.card.type === 'prophecy') || c.prophecyId)
        );
        const needsProphecyDeck = hasProphecyCards && !selectedProphecyDeck;
        return (
            selectedPods.length !== 3 ||
            !deckName ||
            (needsToken && !selectedToken) ||
            needsProphecyDeck
        );
    };

    useEffect(() => {
        dispatch(
            loadDecks({
                page: 1,
                pageSize: 999999,
                sort: 'lastUpdated',
                sortDir: 'desc',
                filter: [{ name: 'isAlliance', value: false }]
            })
        );
        dispatch(clearApiStatus(Decks.SaveAllianceDeck));
    }, [dispatch]);

    let decks = useMemo(() => {
        return dbDecks ? dbDecks.filter((d) => d.expansion == selectedExpansion) : [];
    }, [dbDecks, selectedExpansion]);

    let decksByUuid = useMemo(() => {
        if (!dbDecks) {
            return [];
        }

        return dbDecks.reduce((acc, cur) => {
            acc[cur.uuid] = cur;
            return acc;
        }, {});
    }, [dbDecks]);

    let decksList;

    if (!selectedExpansion) {
        decksList = <AlertPanel type='info'>Please select a set to choose decks from.</AlertPanel>;
    } else if (!decks || decks.length === 0) {
        decksList = <AlertPanel type='info'>There are no decks from this set.</AlertPanel>;
    } else {
        decksList = decks.map((d) => {
            // Find prophecy cards for this deck
            const prophecyCards = d.cards.filter(
                (c) => (c.card && c.card.type === 'prophecy') || c.prophecyId
            );
            const hasProphecies = prophecyCards.length > 0;
            const isSelectedAsProphecy = selectedProphecyDeck === d.uuid;
            // Truncate prophecy names for display
            const prophecyNames = prophecyCards.map((c) =>
                c.card && c.card.name ? c.card.name : c.name || 'Unknown Prophecy'
            );
            const prophecyText = prophecyNames.join(', ');
            const truncatedText =
                prophecyText.length > 40 ? prophecyText.substring(0, 37) + '...' : prophecyText;
            return (
                <div
                    className='mt-2 alliance-deck d-flex flex-column p-2'
                    key={d.id}
                    onMouseOver={() => setCurrentDeck(d)}
                    onMouseOut={() => setCurrentDeck(undefined)}
                >
                    <span>{d.name}</span>
                    <div className='mt-2 d-flex align-items-center'>
                        {d.houses.sort().map((h) => {
                            let selection = [...selectedPods];
                            let selectionKey = `${d.uuid}:${h}`;
                            let imgClass = 'alliance-house';
                            if (selection.includes(selectionKey)) {
                                imgClass += ' selected';
                            }
                            return (
                                <img
                                    className={imgClass}
                                    key={h}
                                    src={Constants.HouseIconPaths[h]}
                                    onClick={() => {
                                        if (
                                            (selection.some((s) => s.includes(h)) ||
                                                selection.length === 3) &&
                                            !selection.includes(selectionKey)
                                        ) {
                                            return;
                                        }
                                        if (selection.includes(selectionKey)) {
                                            selection = selection.filter((s) => s !== selectionKey);
                                        } else {
                                            selection.push(selectionKey);
                                        }
                                        setSelectedPods(selection);
                                    }}
                                />
                            );
                        })}
                    </div>
                    {/* Prophecy selection row - only once per deck, after house icons, and only if a pod from this deck is selected */}
                    {hasProphecies && selectedPods.some((pod) => pod.startsWith(d.uuid + ':')) && (
                        <div
                            className={`prophecy-row mt-1 ${
                                isSelectedAsProphecy ? 'selected' : ''
                            }`}
                            style={{
                                cursor: 'pointer',
                                color: isSelectedAsProphecy ? '#28a745' : '#218838',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 260
                            }}
                            title={prophecyText}
                            onClick={() =>
                                setSelectedProphecyDeck(isSelectedAsProphecy ? null : d.uuid)
                            }
                        >
                            {isSelectedAsProphecy ? '✓ ' : ''}
                            {truncatedText}
                        </div>
                    )}
                    {renderToken(d)}
                </div>
            );
        });
    }

    return (
        <div className='full-height'>
            <Row>
                <Col lg={6} className='full-height'>
                    <Panel title={t('Alliance')}>
                        <ApiStatus
                            state={apiState}
                            onClose={() => dispatch(clearApiStatus(Decks.SaveAllianceDeck))}
                        />
                        <Row>
                            <Col sm={12}>
                                <Button
                                    disabled={isSaveDisabled()}
                                    onClick={() => {
                                        const allianceData = {
                                            name: deckName,
                                            pods: selectedPods,
                                            token: selectedToken
                                        };

                                        // Add prophecy source deck if needed
                                        if (selectedProphecyDeck) {
                                            allianceData.prophecySourceDeck = selectedProphecyDeck;
                                        }

                                        dispatch(saveAllianceDeck(allianceData));
                                    }}
                                >
                                    <Trans>Save</Trans>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} className='mt-2'>
                                <Form.Group>
                                    <Form.Label>
                                        <Trans>Deck Name</Trans>
                                    </Form.Label>
                                    <Form.Control
                                        onChange={(event) => setDeckName(event.target.value)}
                                        value={deckName}
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        <Trans>Set</Trans>
                                    </Form.Label>
                                    <Form.Control
                                        as='select'
                                        onChange={(event) =>
                                            setSelectedExpansion(event.target.value)
                                        }
                                    >
                                        <option value={undefined}>{t('Please select')}</option>
                                        {Constants.Expansions.map((e) => (
                                            <option key={e.value} value={e.value}>
                                                {e.label}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        <Trans>Decks</Trans>
                                    </Form.Label>

                                    <div className='mt-2'>{decksList}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Panel>
                </Col>
                <Col lg={6}>
                    {currentDeck && (
                        <Panel title={currentDeck.name}>
                            <DeckSummary deck={currentDeck} />
                        </Panel>
                    )}
                </Col>
            </Row>
            {zoomCard && (
                <div
                    className='decklist-card-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <CardImage card={Object.assign({}, zoomCard)} />
                </div>
            )}
        </div>
    );
};

AllianceBuilderPage.displayName = 'AllianceBuilder';

export default AllianceBuilderPage;
