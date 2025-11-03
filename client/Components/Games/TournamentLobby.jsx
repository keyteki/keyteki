// @ts-nocheck
import React, { useState } from 'react';
import ReactClipboard from 'react-clipboardjs-copy';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import Button from '../HeroUI/Button';

import NewGame from './NewGame';
import Panel from '../Site/Panel';
import AlertPanel from '../Site/AlertPanel';
import { navigate } from '../../redux/slices/navigationSlice';
import {
    useLoadChallongeTournamentsQuery,
    useLoadChallongeFullTournamentMutation,
    useLoadChallongeMatchesMutation,
    useAttachChallongeMatchLinkMutation
} from '../../redux/slices/apiSlice';

const TournamentLobby = () => {
    const games = useSelector((state) => state.lobby.games);
    const dispatch = useDispatch();
    const [tournament, setTournament] = useState();
    const [matchesToCreate, setMatchesToCreate] = useState([]);
    const { t } = useTranslation();

    // RTK Query hooks
    const {
        data: tournamentsResp,
        isLoading: tournamentsLoading,
        error: tournamentsError,
        refetch: refetchTournaments
    } = useLoadChallongeTournamentsQuery();

    const [
        loadFullTournament,
        { data: fullData, isSuccess: fullSuccess, error: fullError }
    ] = useLoadChallongeFullTournamentMutation();

    const [
        loadMatches,
        {
            data: matchesResp,
            isLoading: matchesLoading,
            isSuccess: matchesSuccess,
            error: matchesError
        }
    ] = useLoadChallongeMatchesMutation();

    const [
        attachMatchLink,
        { data: attachResp, isLoading: attachLoading, isSuccess: attachSuccess, error: attachError }
    ] = useAttachChallongeMatchLinkMutation();

    const tournaments = tournamentsResp?.data || [];
    const participants = fullData?.participants || [];
    const matches = matchesResp?.data || fullData?.matches || [];

    const getParticipantName = (id) => {
        if (!participants) {
            return id;
        }

        const participant = participants.find((participant) => participant.id === id);
        return participant ? participant.name : 'Unknown';
    };

    /**
     * @param {string|number} value
     */
    const createGames = (value) => {
        let matches = matchesWithNoGames;
        if (value !== 'all') {
            matches = matches.filter((match) => match.id === parseInt(value));
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
        <div className='mx-auto max-w-4xl px-4'>
            <Panel title={t('Tournament Organizer Panel')}>
                {tournamentsError && (
                    <AlertPanel
                        type='danger'
                        title={t('Error')}
                        message={tournamentsError?.data?.message || 'Error loading tournaments'}
                    />
                )}
                {fullError && (
                    <AlertPanel
                        type='danger'
                        title={t('Error')}
                        message={fullError?.data?.message || 'Error fetching tournament'}
                    />
                )}
                {matchesError && (
                    <AlertPanel
                        type='danger'
                        title={t('Error')}
                        message={matchesError?.data?.message || 'Error fetching matches'}
                    />
                )}
                {attachError && (
                    <AlertPanel
                        type='danger'
                        title={t('Error')}
                        message={attachError?.data?.message || 'Error sending match links'}
                    />
                )}
                {fullSuccess && fullData?.message && (
                    <AlertPanel type='success' title='' message={fullData.message} />
                )}
                {matchesSuccess && matchesResp?.message && (
                    <AlertPanel type='success' title='' message={matchesResp.message} />
                )}
                {attachSuccess && attachResp?.message && (
                    <AlertPanel type='success' title='' message={attachResp.message} />
                )}
                <div className='grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 items-end'>
                    <div>
                        <select
                            className='w-full border rounded p-2 bg-content1'
                            value={tournament?.id || ''}
                            onChange={(event) => {
                                const id = parseInt(event.target.value);
                                const tmt = tournaments.find((t) => t.id === id);
                                if (tmt) {
                                    loadFullTournament(id);
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
                        <Button color='primary' onPress={() => refetchTournaments()}>
                            <Trans>Refresh Tournaments</Trans>
                            {tournamentsLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}
                        </Button>
                    </div>
                </div>
                <div className='mt-4'>
                    {openMatches[0] && (
                        <div className='text-xl font-extrabold'>
                            {'Round: ' + openMatches[0].round}
                        </div>
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
                                                onPress={() =>
                                                    dispatch(
                                                        navigate('/play', `?gameId=${game.id}`)
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
                                            onPress={() => createGames(match.id.toString())}
                                        >
                                            Create Game
                                        </Button>
                                    )}
                                </div>
                                {index <= 0 && (
                                    <div>
                                        <Button
                                            color='primary'
                                            onPress={() => tournament && loadMatches(tournament.id)}
                                        >
                                            <Trans>Refresh Matches</Trans>
                                            {matchesLoading && (
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
                            onPress={() => createGames('all')}
                        >
                            <Trans>Create All Games</Trans>
                        </Button>
                        <Button
                            color='primary'
                            onPress={sendAttachment}
                            isDisabled={matchesWithGames.length <= 0}
                        >
                            <Trans>Send Attachments</Trans>
                            {attachLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}
                        </Button>
                    </div>
                </div>
            </Panel>
            {matchesToCreate.length > 0 && (
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
