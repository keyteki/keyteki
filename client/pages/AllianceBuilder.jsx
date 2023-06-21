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

import './AllianceBuilder.scss';

const AllianceBuilderPage = () => {
    const { t } = useTranslation();
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
                                    disabled={selectedPods.length !== 3 || !deckName}
                                    onClick={() => {
                                        dispatch(
                                            saveAllianceDeck({ name: deckName, pods: selectedPods })
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

                                <div className='mt-2'>{decksList}</div>
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
        </div>
    );
};

AllianceBuilderPage.displayName = 'AllianceBuilder';

export default AllianceBuilderPage;
