// @ts-nocheck
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAuthTokens } from './authSlice';
import { navigate } from './navigationSlice';

// Base query with automatic token refresh
const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to refresh the token
        const refreshToken = api.getState().auth.refreshToken;

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: '/account/token',
                    method: 'POST',
                    body: { token: refreshToken }
                },
                api,
                extraOptions
            );

            if (refreshResult.data?.success) {
                // Store the new token
                const { token, user } = refreshResult.data;
                api.dispatch(setAuthTokens(token, refreshToken, user));

                // Retry the original query with new token
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Refresh failed, redirect to login
                api.dispatch(navigate('/login'));
            }
        } else {
            api.dispatch(navigate('/login'));
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: 'rtkApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'Decks',
        'Deck',
        'News',
        'User',
        'Profile',
        'Sessions',
        'Blocklist',
        'Games',
        'Banlist',
        'Challonge',
        'StandaloneDecks',
        'Cards',
        'Factions'
    ],
    endpoints: (builder) => ({
        // Account endpoints
        register: builder.mutation({
            query: (user) => ({
                url: '/account/register',
                method: 'POST',
                body: user
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/account/login',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: (tokenId) => ({
                url: '/account/logout',
                method: 'POST',
                body: { tokenId }
            })
        }),
        forgotPassword: builder.mutation({
            query: (details) => ({
                url: '/account/password-reset',
                method: 'POST',
                body: details
            })
        }),
        resetPassword: builder.mutation({
            query: (details) => ({
                url: '/account/password-reset-finish',
                method: 'POST',
                body: details
            })
        }),
        activateAccount: builder.mutation({
            query: (details) => ({
                url: '/account/activate',
                method: 'POST',
                body: details
            })
        }),
        verifyAuth: builder.mutation({
            query: () => ({
                url: '/account/checkauth',
                method: 'POST'
            })
        }),
        linkPatreon: builder.mutation({
            query: (code) => ({
                url: '/account/linkPatreon',
                method: 'POST',
                body: { code }
            })
        }),
        unlinkPatreon: builder.mutation({
            query: () => ({
                url: '/account/unlinkPatreon',
                method: 'POST'
            })
        }),

        // User profile endpoints
        saveProfile: builder.mutation({
            query: ({ username, details }) => ({
                url: `/account/${username}`,
                method: 'PUT',
                body: { data: details }
            }),
            invalidatesTags: ['Profile']
        }),
        loadActiveSessions: builder.query({
            query: (username) => `/account/${username}/sessions`,
            providesTags: ['Sessions']
        }),
        removeSession: builder.mutation({
            query: ({ username, sessionId }) => ({
                url: `/account/${username}/sessions/${sessionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Sessions']
        }),
        loadBlocklist: builder.query({
            query: (username) => `/account/${username}/blocklist`,
            providesTags: ['Blocklist']
        }),
        addBlocklistEntry: builder.mutation({
            query: ({ username, blockedUsername }) => ({
                url: `/account/${username}/blocklist`,
                method: 'POST',
                body: { username: blockedUsername }
            }),
            invalidatesTags: ['Blocklist']
        }),
        removeBlocklistEntry: builder.mutation({
            query: ({ username, blockedUsername }) => ({
                url: `/account/${username}/blocklist/${blockedUsername}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Blocklist']
        }),

        // Deck endpoints
        loadDecks: builder.query({
            query: (options = {}) => ({
                url: '/decks',
                params: options
            }),
            providesTags: ['Decks']
        }),
        loadDeck: builder.query({
            query: (deckId) => `/decks/${deckId}`,
            providesTags: (result, error, deckId) => [{ type: 'Deck', id: deckId }]
        }),
        saveDeck: builder.mutation({
            query: (deck) => ({
                url: '/decks',
                method: 'POST',
                body: { uuid: deck.uuid }
            }),
            invalidatesTags: ['Decks']
        }),
        saveAllianceDeck: builder.mutation({
            query: (deck) => ({
                url: '/decks/alliance',
                method: 'POST',
                body: deck
            }),
            invalidatesTags: ['Decks']
        }),
        deleteDeck: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Decks']
        }),
        saveProphecyAssignments: builder.mutation({
            query: ({ deckId, assignments }) => ({
                url: `/decks/${deckId}/prophecy-assignments`,
                method: 'POST',
                body: { assignments }
            }),
            invalidatesTags: (result, error, { deckId }) => [{ type: 'Deck', id: deckId }]
        }),

        // Admin deck verification endpoints
        verifyDeck: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}/verify`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, deckId) => [{ type: 'Deck', id: deckId }]
        }),
        verifyAllDecks: builder.mutation({
            query: (username) => ({
                url: `/account/${username}/verifyDecks`,
                method: 'POST'
            }),
            invalidatesTags: ['Decks']
        }),

        // Challonge endpoints
        loadChallongeTournaments: builder.query({
            query: () => '/challonge/tournaments',
            providesTags: ['Challonge']
        }),
        loadChallongeFullTournament: builder.mutation({
            query: (tournamentId) => ({
                url: '/challonge/fullTournament',
                method: 'POST',
                body: { data: tournamentId }
            })
        }),
        loadChallongeMatches: builder.mutation({
            query: (tournamentId) => ({
                url: '/challonge/matches',
                method: 'POST',
                body: { data: tournamentId }
            })
        }),
        attachChallongeMatchLink: builder.mutation({
            query: (attachments) => ({
                url: '/challonge/attachMatchLink',
                method: 'POST',
                body: attachments
            })
        }),

        // Cards and reference data endpoints
        loadCards: builder.query({
            query: () => '/cards',
            providesTags: ['Cards']
        }),
        loadFactions: builder.query({
            query: () => '/factions',
            providesTags: ['Factions']
        }),

        loadStandaloneDecks: builder.query({
            query: () => '/standalone-decks',
            providesTags: ['StandaloneDecks']
        }),

        // Game endpoints
        loadUserGames: builder.query({
            query: () => '/games',
            providesTags: ['Games']
        }),

        // News endpoints
        loadNews: builder.query({
            query: () => '/news',
            providesTags: ['News']
        }),
        addNews: builder.mutation({
            query: (newsItem) => ({
                url: '/news',
                method: 'POST',
                body: newsItem
            }),
            invalidatesTags: ['News']
        }),
        saveNews: builder.mutation({
            query: ({ id, text }) => ({
                url: `/news/${id}`,
                method: 'PUT',
                body: { text }
            }),
            invalidatesTags: ['News']
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['News']
        }),

        // Lobby endpoints
        removeLobbyMessage: builder.mutation({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE'
            })
        }),

        // Admin endpoints
        findUser: builder.mutation({
            query: ({ username }) => ({
                url: `/account/find/${username}`,
                method: 'GET'
            })
        }),
        saveUser: builder.mutation({
            query: (user) => ({
                url: `/account/${user.username}`,
                method: 'PUT',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        loadBanlist: builder.query({
            query: () => '/banlist',
            providesTags: ['Banlist']
        }),
        addBanlist: builder.mutation({
            query: (entry) => ({
                url: '/banlist',
                method: 'POST',
                body: entry
            }),
            invalidatesTags: ['Banlist']
        }),
        deleteBanlist: builder.mutation({
            query: (id) => ({
                url: `/banlist/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Banlist']
        })
    })
});

// Export hooks for usage in components
export const {
    // Account
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useActivateAccountMutation,
    useVerifyAuthMutation,
    useLinkPatreonMutation,
    useUnlinkPatreonMutation,

    // User profile
    useSaveProfileMutation,
    useLoadActiveSessionsQuery,
    useRemoveSessionMutation,
    useLoadBlocklistQuery,
    useAddBlocklistEntryMutation,
    useRemoveBlocklistEntryMutation,

    // Decks
    useLoadDecksQuery,
    useLoadDeckQuery,
    useSaveDeckMutation,
    useSaveAllianceDeckMutation,
    useDeleteDeckMutation,
    useLoadStandaloneDecksQuery,
    useSaveProphecyAssignmentsMutation,

    // Games
    useLoadUserGamesQuery,

    // News
    useLoadNewsQuery,
    useAddNewsMutation,
    useSaveNewsMutation,
    useDeleteNewsMutation,

    // Admin
    useFindUserMutation,
    useSaveUserMutation,
    useLoadBanlistQuery,
    useAddBanlistMutation,
    useDeleteBanlistMutation,

    // Challonge
    useLoadChallongeTournamentsQuery,
    useLoadChallongeFullTournamentMutation,
    useLoadChallongeMatchesMutation,
    useAttachChallongeMatchLinkMutation,

    // Cards and reference data
    useLoadCardsQuery,
    useLoadFactionsQuery,

    // Lobby
    useRemoveLobbyMessageMutation,

    // Admin deck operations
    useVerifyDeckMutation,
    useVerifyAllDecksMutation
} = api;
