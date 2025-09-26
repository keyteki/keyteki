import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Panel from '../Components/Site/Panel';
import CardBack from '../Components/Decks/CardBack';
import { loadStats } from '../redux/actions';
import { clearApiStatus } from '../redux/actions';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter,Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
// const data = [
//     {
//         level: 'Beginner',
//         win: 40,
//         loss: 2,
//         ratio: 89
//     },
//     {
//         level: 'Casual',
//         win: 40,
//         loss: 40,
//         ratio: 50
//     },
//     {
//         level: 'Competitive',
//         win: 20,
//         loss: 80,
//         ratio: 20
//     }
// ];

// const renderCustomizedLabel = (props) => {
//     const { x, y, width, value } = props;
//     const radius = 10;
//     return (
//       <g>
//         <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
//         <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
//           {value.split(' ')[1]}
//         </text>
//       </g>
//     );
//   };
const DecksComponent = () => {
    const { user } = useSelector((state) => ({
        user: state.account.user
    }));
    const { deck } = useSelector((state) => ({
        deck: state.cards.selectedDeck
    }));
    let { stats } = useSelector((state) => ({
        stats: state.stats
    }));
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
            // if (user != null && deck != null) {
            dispatch(
                loadStats({
                    userId: 1,
                    deckId: 5
                })
        );
            // }
        },
        [dispatch, stats]
    );
    

    console.log(JSON.stringify(stats));

    console.log(JSON.stringify(deck.id));
    console.log(JSON.stringify(user.id));

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
                                    {/* <BarChart
                                        width={500}
                                        height={300}
                                        data={stats.statTable}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='level' />
                                        <YAxis yAxisId={0} />
                                        <YAxis yAxisId={1} orientation='right' />
                                        <Tooltip /> 
                                        <Legend />
                                        <Bar
                                            dataKey='loss'
                                            stackId='a'
                                            fill='#FF0000'
                                            yAxisId={0}
                                        />
                                        <Bar dataKey='win' stackId='a' fill='#00FF00' yAxisId={0} /> */}
                                        {/* <Bar dataKey='ratio' fill='#0000AA' yAxisId={1} /> */}
                                        {/* <Scatter dataKey='ratio' fill='blue' yAxisId={1} /> */}
                                    {/* </BarChart> */}
                                </Row>
                            </Col>
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
