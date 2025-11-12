/**
 * Socket actions file
 *
 * This file contains the handoff handler for game connection.
 * Lobby socket actions are in lobbySlice and handled by socketMiddleware.
 * Game socket actions are in gamesSlice and handled by gameSocketMiddleware.
 */

import * as actions from '.';
import * as gamesActions from '../slices/gamesSlice';

// Handoff handler for game connection
export function handoffReceived(details) {
    return (dispatch, getState) => {
        let url =
            details.address && details.address !== 'undefined'
                ? '//' + details.address
                : '//' + window.location.hostname;
        let standardPorts = [80, 443];
        let state = getState();

        dispatch(gamesActions.handoffReceived({ gameId: details.gameId }));

        if (details.port && !standardPorts.some((p) => p === details.port)) {
            url += ':' + details.port;
        }

        dispatch(actions.setAuthTokens(details.authToken, state.auth.refreshToken, details.user));

        if (state.games.socket && state.games.gameId !== details.gameId) {
            dispatch(gamesActions.closeGameSocket());
        }

        dispatch(gamesActions.connectGameSocket({ url, name: details.name }));
    };
}
