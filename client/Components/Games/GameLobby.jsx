import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import $ from 'jquery';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Modal from '../Site/Modal';
import Checkbox from '../Form/Checkbox';

import * as actions from '../../redux/actions';

import { withTranslation, Trans, useTranslation } from 'react-i18next';
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';

import './GameLobby.scss';
import { useEffect } from 'react';
import { startNewGame } from '../../redux/actions';

const GameState = Object.freeze({
    None: 0,
    NewGame: 1,
    PendingGame: 2,
    PasswordedGame: 3,
    Started: 4
});

function isNewNotificationSupported() {
    if (!window.Notification || !Notification.requestPermission) {
        return false;
    }

    if (Notification.permission == 'granted')
        throw new Error('You must only call this before calling Notification.requestPermission()');
    try {
        new Notification('');
    } catch (e) {
        if (e.name == 'TypeError') {
            return false;
        }
    }

    return true;
}

const GameLobby = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const filters = [
        { name: 'beginner', label: t('Beginner') },
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Competitive') },
        { name: 'normal', label: t('Normal') },
        { name: 'sealed', label: t('Sealed') },
        { name: 'reversal', label: t('Reversal') }
    ];
    const filterDefaults = {};

    for (const filter of filters) {
        filterDefaults[filter.name] = true;
    }

    const { games, newGame } = useSelector((state) => ({
        games: state.lobby.games,
        newGame: state.lobby.newGame
    }));
    const [currentFilter, setCurrentFilter] = useState(filterDefaults);
    const [quickJoin, setQuickJoin] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission(() => {});
            }
        }
    }, []);

    const onFilterChecked = (name, checked) => {
        currentFilter[name] = checked;
        setCurrentFilter(Object.assign({}, currentFilter));
    };

    return (
        <Col md={{ offset: 2, span: 8 }}>
            {newGame && <NewGame quickJoin={quickJoin} />}
            <Panel title={t('Current Games')}>
                <Row className='game-buttons'>
                    <Col sm={4} lg={3}>
                        <Button variant='primary' onClick={() => dispatch(startNewGame())}>
                            <Trans>New Game</Trans>
                        </Button>
                        <Button variant='primary'>
                            <Trans>Quick Join</Trans>
                        </Button>
                    </Col>
                    <Col sm={8} lg={9}>
                        <Panel type='primary'>
                            <Row>
                                {filters.map((filter) => {
                                    return (
                                        <Col key={filter.name} sm={6} lg={4}>
                                            <Form.Check
                                                type='switch'
                                                id={filter.name}
                                                label={filter.label}
                                                inline
                                                onChange={(event) => {
                                                    onFilterChecked(
                                                        filter.name,
                                                        event.target.checked
                                                    );
                                                }}
                                                checked={currentFilter[filter.name]}
                                            ></Form.Check>
                                        </Col>
                                    );
                                })}
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Check
                                        type='switch'
                                        id='onlyShowNew'
                                        label={t('Only show new games')}
                                        inline
                                        onChange={(event) => {
                                            onFilterChecked('onlyShowNew', event.target.checked);
                                        }}
                                        checked={currentFilter['onlyShowNew']}
                                    ></Form.Check>
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col xs='12' className='text-center'>
                        {games.length === 0 ? (
                            <Alert variant='info'>{t('No games are currently in progress.')}</Alert>
                        ) : (
                            <GameList games={games} gameFilter={currentFilter} />
                        )}
                    </Col>
                </Row>
            </Panel>
        </Col>
    );

    // <GameList games={games} gameFilter={currentFilter} />
    //         let modalProps = {
    //             bodyClassName: 'col-xs-12',
    //             className: 'settings-popup row',
    //             defaultGameType: 'casual',
    //             id: 'pendingGameModal',
    //             noClickToClose: true,
    //             title: ''
    //         };
    //         let modalBody = null;

    //         switch (this.state.gameState) {
    //             case GameState.None:
    //             default:
    //                 break;
    //             case GameState.NewGame:
    //                 modalProps.title = t('Game Options');
    //                 modalProps.okButton = t('Create');
    //                 modalBody = (
    //                     <NewGame
    //                         defaultGameName={this.props.user.username + "'s game"}
    //                         quickJoin={this.state.quickJoin}
    //                     />
    //                 );
    //                 break;
    //             case GameState.PendingGame:
    //                 modalProps.title = this.props.currentGame ? this.props.currentGame.name : '';
    //                 modalBody = this.props.currentGame ? <PendingGame /> : null;
    //                 break;
    //             case GameState.PasswordedGame:
    //                 modalProps.title = t('Password Required');
    //                 modalBody = <PasswordGame />;
    //                 break;
    //         }

    //         return (
    //             <div className='full-height'>
    //                 {this.props.bannerNotice ? (
    //                     <AlertPanel type='error' message={t(this.props.bannerNotice)} />
    //                 ) : null}
    //                 {this.state.errorMessage ? (
    //                     <AlertPanel type='error' message={t(this.state.errorMessage)} />
    //                 ) : null}

    //                 <div className='col-md-offset-2 col-md-8 full-height'>
    //                     <Panel title={t('Current Games')}>
    //                         <div className='col-xs-12'>
    //                             {this.props.games.length === 0 ? (
    //                                 <AlertPanel
    //                                     type='info'
    //                                     message={t('No games are currently in progress.')}
    //                                 />
    //                             ) : (
    //                                 <GameList games={this.props.games} gameFilter={this.state.filter} />
    //                             )}
    //                         </div>
    //                     </Panel>
    //                 </div>
    //                 <Modal {...modalProps}>{modalBody}</Modal>
    //             </div>
    //         );
    //     }
};

// class GameLobby extends React.Component {
//     constructor(props) {
//         super(props);

//         this.onNewGameClick = this.onNewGameClick.bind(this);
//         this.onQuickJoinClick = this.onQuickJoinClick.bind(this);
//         this.onModalHidden = this.onModalHidden.bind(this);

//         let savedFilter = localStorage.getItem('gameFilter');
//         if (savedFilter) {
//             savedFilter = JSON.parse(savedFilter);
//         } else {
//             savedFilter = {};
//         }

//         let filterDefaults = {
//             beginner: true,
//             casual: true,
//             competitive: true,
//             normal: true,
//             sealed: true,
//             reversal: true,
//             'adaptive-bo1': true,
//             showOnlyNewGames: false
//         };

//         this.state = {
//             gameState: GameState.None,
//             filter: Object.assign(filterDefaults, savedFilter)
//         };
//     }

//     componentDidMount() {
//         $('#pendingGameModal').on('hide.bs.modal', this.onModalHidden);

//         if (window.Notification && Notification.permission !== 'granted') {
//             Notification.requestPermission((status) => {
//                 if (Notification.permission !== status) {
//                     try {
//                         Notification.permission = status;
//                     } catch (err) {
//                         // Some browsers don't allow updating it this way
//                     }
//                 }
//             });
//         }

//         if (this.props.gameId && this.props.games.length > 0) {
//             this.useGameLink(this.props.games);
//         }
//     }

//     // eslint-disable-next-line camelcase
//     UNSAFE_componentWillReceiveProps(props) {
//         if (!props.currentGame) {
//             this.props.setContextMenu([]);
//         }

//         if (props.user) {
//             this.setState({ errorMessage: undefined });
//         }

//         this.setGameState(props);

//         if (!this.isPendingGameStillCurrent(props) || this.isGameInProgress(props)) {
//             this.setState(
//                 {
//                     gameState:
//                         props.currentGame && props.currentGame.started
//                             ? GameState.Started
//                             : GameState.None
//                 },
//                 () => {
//                     $('#pendingGameModal').modal('hide');
//                 }
//             );
//         } else if (!this.isPasswordGameStillCurrent(props) && !props.currentGame) {
//             $('#pendingGameModal').modal('hide');
//         } else if (!this.props.passwordGame && props.passwordGame) {
//             $('#pendingGameModal').modal('show');
//         }

//         if (props.currentGame && !this.props.currentGame && !props.currentGame.started) {
//             // Joining a game
//             $('#pendingGameModal').modal('show');
//             this.setState({ gameState: GameState.PendingGame });
//         }

//         if (!props.currentGame && this.props.gameId && props.games.length > 0) {
//             this.useGameLink(props.games);
//         }
//     }

//     useGameLink(games) {
//         const game = games.find((x) => x.id === this.props.gameId);

//         if (!game) {
//             toastr.error('The game you tried to join was not found.');
//             return;
//         }

//         if (!game.started && Object.keys(game.players).length < 2) {
//             if (game.needsPassword) {
//                 this.props.joinPasswordGame(game, 'Join');
//             } else {
//                 this.props.socket.emit('joingame', this.props.gameId);
//             }
//         } else {
//             if (game.needsPassword) {
//                 this.props.joinPasswordGame(game, 'Watch');
//             } else {
//                 this.props.socket.emit('watchgame', game.id);
//             }
//         }

//         this.props.setUrl('/play');
//     }

//     setGameState(props) {
//         if (props.passwordGame) {
//             this.setState({ gameState: GameState.PasswordedGame });
//         } else if (props.currentGame && !props.currentGame.started) {
//             this.setState({ gameState: GameState.PendingGame });
//         } else if (props.currentGame && props.currentGame.started) {
//             this.setState({ gameState: GameState.Started });
//         } else if (!props.currentGame && props.newGame && props.user) {
//             this.setState({ gameState: GameState.NewGame });
//         }
//     }

//     isPendingGameStillCurrent(props) {
//         if (this.props.newGame && !props.newGame) {
//             return false;
//         }

//         if (this.props.currentGame && !props.currentGame) {
//             return false;
//         }

//         return true;
//     }

//     isPasswordGameStillCurrent(props) {
//         if (this.props.passwordGame && !props.passwordGame) {
//             return false;
//         }

//         return true;
//     }

//     isGameInProgress(props) {
//         if (
//             props.currentGame &&
//             props.currentGame.started &&
//             (!this.props.currentGame || !this.props.currentGame.started)
//         ) {
//             return true;
//         }

//         return false;
//     }

//     startNewGame() {
//         if (!this.props.user) {
//             this.setState({ errorMessage: 'Please login before trying to start a new game' });

//             return;
//         }

//         $('#pendingGameModal').modal('show');

//         this.props.startNewGame();
//     }

//     onNewGameClick(event) {
//         event.preventDefault();

//         this.setState({ quickJoin: false });

//         this.startNewGame();
//     }

//     onQuickJoinClick(event) {
//         event.preventDefault();

//         this.setState({ quickJoin: true });

//         this.startNewGame();
//     }

//     onModalHidden(event) {
//         if ($(event.target).attr('id') !== 'pendingGameModal') {
//             return;
//         }

//         switch (this.state.gameState) {
//             case GameState.NewGame:
//                 this.props.cancelNewGame();
//                 break;
//             case GameState.PasswordedGame:
//                 this.props.cancelPasswordJoin();
//                 break;
//             case GameState.PendingGame:
//                 if (!this.props.currentGame.started) {
//                     this.props.leaveGame(this.props.currentGame.id);
//                 }

//                 break;
//         }

//         this.setGameState(this.props);
//     }

//     onCheckboxChange(field, event) {
//         let filter = Object.assign({}, this.state.filter);

//         filter[field] = event.target.checked;

//         this.setState({ filter: filter });

//         localStorage.setItem('gameFilter', JSON.stringify(filter));
//     }

// }

// GameLobby.displayName = 'GameLobby';
// GameLobby.propTypes = {
//     bannerNotice: PropTypes.string,
//     cancelNewGame: PropTypes.func,
//     cancelPasswordJoin: PropTypes.func,
//     currentGame: PropTypes.object,
//     gameId: PropTypes.string,
//     games: PropTypes.array,
//     i18n: PropTypes.object,
//     joinPasswordGame: PropTypes.func,
//     leaveGame: PropTypes.func,
//     newGame: PropTypes.bool,
//     passwordGame: PropTypes.object,
//     setContextMenu: PropTypes.func,
//     setUrl: PropTypes.func,
//     socket: PropTypes.object,
//     startNewGame: PropTypes.func,
//     t: PropTypes.func,
//     user: PropTypes.object
// };

// function mapStateToProps(state) {
//     return {
//         bannerNotice: state.lobby.notice,
//         currentGame: state.lobby.currentGame,
//         games: state.lobby.games,
//         newGame: state.lobby.newGame,
//         passwordGame: state.lobby.passwordGame,
//         setUrl: state.lobby.setUrl,
//         socket: state.lobby.socket,
//         user: state.account.user
//     };
// }

export default GameLobby;
