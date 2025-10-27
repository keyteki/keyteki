import React, { useState, useEffect } from 'react';
import ReactClipboard from 'react-clipboardjs-copy';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@heroui/react';

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
        <div className='mx-auto max-w-4xl px-4'>
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
                <div className='grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 items-end'>
                    <div>
                        <select
                            className='w-full border rounded p-2 bg-content1'
                            value={tournament?.id || ''}
                            onChange={(event) => {
                                const id = parseInt(event.target.value);
                                const tmt = tournaments.find((t) => t.id === id);
                                if (tmt) {
                                    dispatch(fetchFullTournament(id));
                                    setTournament(tmt);
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
                        </select>
                    </div>
                    <div>
                        <Button color='primary' onClick={() => dispatch(fetchTournaments())}>
                            <Trans>Refresh Tournaments</Trans>
                            {requestTournamentsState?.loading && (
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                            )}
                        </Button>
                    </div>
                </div>
                <div className='mt-4'>
                    {openMatches[0] && (
                        <div className='match-round'>{'Round: ' + openMatches[0].round}</div>
                    )}
                    {openMatches.map((match, index) => {
                        const game = tournamentGames.find(
                            (game) => game.challonge && game.challonge.matchId === match.id
                        );
                        return (
                            <div
                                className='grid grid-cols-1 sm:grid-cols-[5fr_3fr_3fr] gap-2 mb-1'
                                key={index}
                            >
                                <div>
                                    Table {index + 1}: {getParticipantName(match.player1_id)} vs{' '}
                                    {getParticipantName(match.player2_id)} (
                                    {game && game.started ? 'In Progress' : 'Pending'})
                                </div>
                                <div>
                                    {game ? (
                                        game.started ? (
                                            <Button
                                                color='primary'
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
                                                <Button color='primary'>Copy Game Link</Button>
                                            </ReactClipboard>
                                        )
                                    ) : (
                                        <Button
                                            color='primary'
                                            value={match.id}
                                            onClick={createGames}
                                        >
                                            Create Game
                                        </Button>
                                    )}
                                </div>
                                {index <= 0 && (
                                    <div>
                                        <Button
                                            color='primary'
                                            onClick={() => dispatch(fetchMatches(tournament.id))}
                                        >
                                            <Trans>Refresh Matches</Trans>
                                            {matchState?.loading && (
                                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div className='text-center mt-3'>
                        <Button
                            color='primary'
                            value='all'
                            isDisabled={matchesWithNoGames.length <= 0}
                            onClick={createGames}
                        >
                            <Trans>Create All Games</Trans>
                        </Button>
                        <Button
                            color='primary'
                            onClick={sendAttachment}
                            isDisabled={matchesWithGames.length <= 0}
                        >
                            <Trans>Send Attachments</Trans>
                            {attachmentState?.loading && (
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                            )}
                        </Button>
                    </div>
                </div>
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
        </div>
    );
};

export default TournamentLobby;
