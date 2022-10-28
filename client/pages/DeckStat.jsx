import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Panel from '../Components/Site/Panel';
import CardBack from '../Components/Decks/CardBack';

const DecksComponent = () => {
    const { t } = useTranslation();

    const { deck } = useSelector((state) => ({
        deck: state.cards.selectedDeck
    }));

    return (
        <div className='text-center'>
            <Col md='2'></Col>
            <Col md='8'>
                <Panel title={deck.name}>
                    <Col className='text-center'>
                        <Row>
                            <Col />
                            <Col sm='2'>
                                <CardBack deck={deck} size={'x-large'} />
                            </Col>
                            <Col />
                        </Row>
                        <Row>
                            <Col sm='12'>
                                <Row>
                                    <Col></Col>
                                    <Col>{t('All')}</Col>
                                    <Col>{t('Beginner')}</Col>
                                    <Col>{t('Casual')}</Col>
                                    <Col>{t('Competitive')}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span>{t('Wins')}</span>
                                    </Col>
                                    <Col>{deck.wins}</Col>
                                    <Col>{deck.beginnerWins}</Col>
                                    <Col>{deck.casualWins}</Col>
                                    <Col>{deck.competitiveWins}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span>{t('Losses')}</span>
                                    </Col>
                                    <Col>{deck.losses}</Col>
                                    <Col>{deck.beginnerLosses}</Col>
                                    <Col>{deck.casualLosses}</Col>
                                    <Col>{deck.competitiveLosses}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span>{t('Total')}</span>
                                    </Col>
                                    <Col>{parseInt(deck.wins) + parseInt(deck.losses)}</Col>
                                    <Col>
                                        {parseInt(deck.beginnerWins) +
                                            parseInt(deck.beginnerLosses)}
                                    </Col>
                                    <Col>
                                        {parseInt(deck.casualWins) + parseInt(deck.casualLosses)}
                                    </Col>
                                    <Col>
                                        {parseInt(deck.competitiveWins) +
                                            parseInt(deck.competitiveLosses)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span>{t('Win Rate')}</span>
                                    </Col>
                                    <Col>{deck.winRate?.toFixed(2)}%</Col>
                                    <Col>{deck.beginnerWinRate?.toFixed(2)}%</Col>
                                    <Col>{deck.casualWinRate?.toFixed(2)}%</Col>
                                    <Col>{deck.competitiveWinRate?.toFixed(2)}%</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Panel>
            </Col>
            <Col md='2'></Col>
        </div>
    );
};

DecksComponent.displayName = 'Decks';

export default DecksComponent;
