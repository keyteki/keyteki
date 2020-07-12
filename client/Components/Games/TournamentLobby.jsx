import React, { useState, useEffect } from 'react';
import ReactClipboard from 'react-clipboardjs-copy';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { Col, Button, Form, Row } from 'react-bootstrap';

import NewGame from './NewGame';
import Panel from '../Site/Panel';
import ApiStatus from '../Site/ApiStatus';
import {
    fetchTournaments,
    fetchFullTournament,
    attachMatchLink,
    navigate,
    clearApiStatus,
    fetchMatches
} from '../../redux/actions';
import { Challonge } from '../../redux/types';

import './TournamentLobby.scss';

const TournamentLobby = () => {
    const { tournaments, matches, message, participants, success } = useSelector((state) => ({
        matches: state.challonge.matches,
        message: state.challonge.message,
        success: state.challonge.success,
        participants: state.challonge.participants,
        tournaments: state.challonge.tournaments
    }));
    const games = useSelector((state) => state.lobby.games);
    const dispatch = useDispatch();
    const [tournament, setTournament] = useState();
    const [matchesToCreate, setMatchesToCreate] = useState();
    const { t } = useTranslation();
    const requestTournamentsState = useSelector((state) => {
        const retState = state.api[Challonge.RequestTournaments];

        if (retState && retState.success) {
            retState.message = t('Tournaments fetched successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Challonge.RequestTournaments));
            }, 5000);
        }

        return retState;
    });
    const fullTournamentState = useSelector((state) => {
        const retState = state.api[Challonge.RequestFullTournament];

        if (retState && retState.success) {
            retState.message = t('Tournament fetched successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Challonge.RequestFullTournament));
            }, 5000);
        }

        return retState;
    });
    const matchState = useSelector((state) => {
        const retState = state.api[Challonge.RequestMatches];

        if (retState && retState.success) {
            retState.message = t('Matches fetched successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Challonge.RequestMatches));
            }, 5000);
        }

        return retState;
    });
    const attachmentState = useSelector((state) => {
        const retState = state.api[Challonge.CreateAttachments];

        if (retState && retState.success) {
            retState.message = t('Attachments created successfully');

            setTimeout(() => {
                dispatch(clearApiStatus(Challonge.CreateAttachments));
            }, 5000);
        }

        return retState;
    });

    useEffect(() => {
        if (!tournaments) {
            dispatch(fetchTournaments());
        }

        if (matches?.length > 0) {
            let tournament = tournaments.find((x) => x.id === matches[0].tournament_id);
            setTournament(tournament);
        }

        if (message) {
            const type = success ? 'success' : 'error';
            toastr[type](type, t(message));
        }
    }, [tournaments, matches, message, dispatch, success, t]);

    const getParticipantName = (id) => {
        if (!participants) {
            return id;
        }

        const participant = participants.find((participant) => participant.id === id);
        return participant ? participant.display_name : 'Unknown';
    };

    const createGames = (event) => {
        let matches = matchesWithNoGames;
        if (event.target.value !== 'all') {
            matches = matches.filter((match) => match.id === parseInt(event.target.value));
        }

        setMatchesToCreate(matches);
    };

    const getMatchLink = (game) => {
        if (game) {
            return `${window.location.protocol}//${window.location.host}/play?gameId=${game.id}`;
        }
    };

    const sendAttachment = () => {
        const matchData = tournamentGames.map((game) => {
            return {
                attachment: getMatchLink(game),
                matchId: game.challonge.matchId,
                tournamentId: game.challonge.tournamentId
            };
        });

        dispatch(attachMatchLink(matchData));
    };

    let openMatches = matches?.filter((match) => match.state === 'open') || [];

    const tournamentGames = games.filter(
        (game) => game.challonge && game.challonge.tournamentId === tournament?.id
    );

    const matchesWithNoGames = openMatches.filter(
        (match) => !tournamentGames.map((game) => game.challonge.matchId).includes(match.id)
    );

    const matchesWithGames = openMatches.filter((match) =>
        tournamentGames.map((game) => game.challonge.matchId).includes(match.id)
    );

    return (
        <Col md={{ span: 8, offset: 2 }}>
            <Panel title={t('Tournament Organizer Panel')}>
                <ApiStatus
                    state={requestTournamentsState}
                    onClose={() => dispatch(clearApiStatus(Challonge.RequestTournaments))}
                />
                <ApiStatus
                    state={fullTournamentState}
                    onClose={() => dispatch(clearApiStatus(Challonge.RequestFullTournament))}
                />
                <ApiStatus
                    state={matchState}
                    onClose={() => dispatch(clearApiStatus(Challonge.RequestMatches))}
                />
                <ApiStatus
                    state={attachmentState}
                    onClose={() => dispatch(clearApiStatus(Challonge.CreateAttachments))}
                />
                <Row>
                    <Form.Group as={Col} sm='8'>
                        <Form.Control
                            as='select'
                            value={tournament?.id}
                            onChange={() => {
                                let tournament = tournaments.find(
                                    (t) => t.id === parseInt(event.target.value)
                                );

                                if (tournament) {
                                    dispatch(fetchFullTournament(event.target.value));
                                    setTournament(tournament);
                                }
                            }}
                        >
                            {!tournament?.id && <option />}
                            {tournaments?.map((tournament, index) => (
                                <option
                                    value={tournament.id}
                                    key={index}
                                >{`${tournament.name} (${tournament.state})`}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Col sm='4'>
                        <Button variant='primary' onClick={() => dispatch(fetchTournaments())}>
                            <Trans>Refresh Tournaments</Trans>
                            {requestTournamentsState?.loading && (
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                            )}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {openMatches[0] && (
                            <div className='match-round'>{'Round: ' + openMatches[0].round}</div>
                        )}
                        {openMatches.map((match, index) => {
                            const game = tournamentGames.find(
                                (game) => game.challonge && game.challonge.matchId === match.id
                            );
                            return (
                                <Row className='mb-1' key={index}>
                                    <Col sm='5'>
                                        Table {index + 1}: {getParticipantName(match.player1_id)} vs{' '}
                                        {getParticipantName(match.player2_id)} (
                                        {game && game.started ? 'In Progress' : 'Pending'})
                                    </Col>
                                    <Col sm='3'>
                                        {game ? (
                                            game.started ? (
                                                <Button
                                                    variant='primary'
                                                    value={game.id}
                                                    onClick={(event) =>
                                                        dispatch(
                                                            navigate(
                                                                '/play',
                                                                `?gameId=${event.target.value}`
                                                            )
                                                        )
                                                    }
                                                >
                                                    <Trans>Watch</Trans>
                                                </Button>
                                            ) : (
                                                <ReactClipboard text={getMatchLink(game)}>
                                                    <Button variant='primary'>
                                                        Copy Game Link
                                                    </Button>
                                                </ReactClipboard>
                                            )
                                        ) : (
                                            <Button
                                                variant='primary'
                                                value={match.id}
                                                onClick={createGames}
                                            >
                                                Create Game
                                            </Button>
                                        )}
                                    </Col>
                                    {index <= 0 && (
                                        <Col sm='3'>
                                            <Button
                                                variant='primary'
                                                onClick={() =>
                                                    dispatch(fetchMatches(tournament.id))
                                                }
                                            >
                                                <Trans>Refresh Matches</Trans>
                                                {matchState?.loading && (
                                                    <FontAwesomeIcon icon={faCircleNotch} spin />
                                                )}
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                            );
                        })}
                        <div className='text-center mt-3'>
                            <Button
                                variant='primary'
                                value='all'
                                disabled={matchesWithNoGames.length <= 0}
                                onClick={createGames}
                            >
                                <Trans>Create All Games</Trans>
                            </Button>
                            <Button
                                variant='primary'
                                onClick={sendAttachment}
                                disabled={matchesWithGames.length <= 0}
                            >
                                <Trans>Send Attachments</Trans>
                                {attachmentState?.loading && (
                                    <FontAwesomeIcon icon={faCircleNotch} spin />
                                )}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Panel>
            {matchesToCreate?.length > 0 && (
                <NewGame
                    onClosed={() => setMatchesToCreate([])}
                    defaultGameType='competitive'
                    defaultPrivate
                    defaultTimeLimit={35}
                    getParticipantName={getParticipantName}
                    matches={matchesToCreate}
                    tournament={tournament}
                />
            )}
        </Col>
    );
};

export default TournamentLobby;
