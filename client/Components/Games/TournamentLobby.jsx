import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ReactClipboard from 'react-clipboardjs-copy';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
    useAttachMatchLinkMutation,
    useGetFullTournamentMutation,
    useGetMatchesMutation,
    useGetTournamentsQuery
} from '../../redux/api';
import ApiStatus from '../Site/ApiStatus';
import Panel from '../Site/Panel';
import NewGame from './NewGame';

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
    const navigate = useNavigate();
    const [tournament, setTournament] = useState();
    const [matchesToCreate, setMatchesToCreate] = useState();
    const { t } = useTranslation();
    const { isLoading: tournamentsLoading, refetch: refetchTournaments } = useGetTournamentsQuery();
    const [fetchFullTournament, fullTournamentState] = useGetFullTournamentMutation();
    const [fetchMatches, matchState] = useGetMatchesMutation();
    const [attachMatchLink, attachmentState] = useAttachMatchLinkMutation();

    useEffect(() => {
        if (matches?.length > 0) {
            let tournament = tournaments.find((x) => x.id === matches[0].tournament_id);
            setTournament(tournament);
        }

        if (message) {
            const type = success ? 'success' : 'error';
            toast[type](t(message));
        }
    }, [tournaments, matches, message, success, t]);

    const getParticipantName = (id) => {
        if (!participants) {
            return id;
        }

        const participant = participants.find((participant) => participant.id === id);
        return participant ? participant.name : 'Unknown';
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

        attachMatchLink(matchData);
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
                <ApiStatus state={tournamentsLoading ? { loading: true } : null} />
                <ApiStatus
                    state={
                        fullTournamentState.isUninitialized
                            ? null
                            : {
                                  loading: fullTournamentState.isLoading,
                                  success: fullTournamentState.isSuccess,
                                  message: fullTournamentState.isSuccess
                                      ? t('Tournament fetched successfully')
                                      : fullTournamentState.error?.data?.message
                              }
                    }
                    onClose={() => fullTournamentState.reset()}
                />
                <ApiStatus
                    state={
                        matchState.isUninitialized
                            ? null
                            : {
                                  loading: matchState.isLoading,
                                  success: matchState.isSuccess,
                                  message: matchState.isSuccess
                                      ? t('Matches fetched successfully')
                                      : matchState.error?.data?.message
                              }
                    }
                    onClose={() => matchState.reset()}
                />
                <ApiStatus
                    state={
                        attachmentState.isUninitialized
                            ? null
                            : {
                                  loading: attachmentState.isLoading,
                                  success: attachmentState.isSuccess,
                                  message: attachmentState.isSuccess
                                      ? t('Attachments created successfully')
                                      : attachmentState.error?.data?.message
                              }
                    }
                    onClose={() => attachmentState.reset()}
                />
                <Row>
                    <Form.Group as={Col} sm='8'>
                        <Form.Control
                            as='select'
                            value={tournament?.id}
                            onChange={(event) => {
                                let nextTournament = tournaments.find(
                                    (t) => t.id === parseInt(event.target.value)
                                );

                                if (nextTournament) {
                                    fetchFullTournament(event.target.value);
                                    setTournament(nextTournament);
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
                        <Button variant='primary' onClick={() => refetchTournaments()}>
                            <Trans>Refresh Tournaments</Trans>
                            {tournamentsLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {openMatches[0] && (
                            <div className='match-turn'>{'Turn: ' + openMatches[0].turn}</div>
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
                                                        navigate(
                                                            `/play?gameId=${event.target.value}`
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
                                                onClick={() => fetchMatches(tournament.id)}
                                            >
                                                <Trans>Refresh Matches</Trans>
                                                {matchState.isLoading && (
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
                                {attachmentState.isLoading && (
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
                    defaultTimeLimit={45}
                    getParticipantName={getParticipantName}
                    matches={matchesToCreate}
                    tournament={tournament}
                />
            )}
        </Col>
    );
};

export default TournamentLobby;
