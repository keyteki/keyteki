import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row, Form, Button } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Decks } from '../redux/types';
import { clearApiStatus, navigate, saveAllianceDeck } from '../redux/actions';
import { Constants } from '../constants';
import { loadDecks } from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import DeckSummary from '../Components/Decks/DeckSummary';
import CardImage from '../Components/GameBoard/CardImage';

import './AllianceBuilder.scss';

const AllianceBuilderPage = () => {
    const { i18n, t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Decks.SaveAllianceDeck];

        if (retState && retState.success) {
            retState.message = t('Deck added successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Decks.SaveAllianceDeck));
                dispatch(navigate('/decks'));
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
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });

    const renderToken = (deck) => {
        if (!deck.cards.some((d) => d.isNonDeck && d.id !== 'the-tide')) {
            return null;
        }

        let tokenCard = deck.cards.find((d) => d.isNonDeck);
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
        const needsToken = selectedDecks.some((d) =>
            d.cards.some((c) => c.isNonDeck && c.id !== 'the-tide')
        );

        return selectedPods.length !== 3 || !deckName || (needsToken && !selectedToken);
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
        decksList = decks.map((d) => (
            <div
                className='mt-2 alliance-deck d-flex flex-column p-2'
                key={d.id}
                onMouseOver={() => setCurrentDeck(d)}
                onMouseOut={() => setCurrentDeck(undefined)}
            >
                <span>{d.name}</span>
                <div className='mt-2'>
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
                {renderToken(d)}
            </div>
        ));
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
                                        dispatch(
                                            saveAllianceDeck({
                                                name: deckName,
                                                pods: selectedPods,
                                                token: selectedToken
                                            })
                                        );
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
