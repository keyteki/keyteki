import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAG_TYPES } from './apiTags';
import { setAuthTokens, authActions } from './slices/authSlice';
import { lobbyAuthenticateRequested } from './socketActions';

const NEWS_LIST_ID = 'LIST';
const DECKS_LIST_ID = 'LIST';
const BANLIST_ID = 'LIST';
const CHALLONGE_ID = 'LIST';
const SESSIONS_ID = 'LIST';
const BLOCKLIST_ID = 'LIST';
const GAMES_ID = 'LIST';

const getNewsTags = (result) => {
    const items = result?.news || [];
    return [
        { type: TAG_TYPES.NEWS, id: NEWS_LIST_ID },
        ...items.map((item) => ({ type: TAG_TYPES.NEWS, id: item.id }))
    ];
};

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
    validateStatus: (response, result) => {
        if (response.status !== 200) {
            return false;
        }
        return !(result && result.success === false);
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    const errorStatus = result.error?.status;
    const originalStatus = result.error?.originalStatus;
    const isUnauthorized = errorStatus === 401 || originalStatus === 401;
    if (result.error && isUnauthorized) {
        const refreshToken = api.getState()?.auth?.refreshToken;
        if (!refreshToken) {
            return result;
        }

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
            api.dispatch(
                setAuthTokens({
                    token: refreshResult.data.token,
                    refreshToken,
                    user: refreshResult.data.user
                })
            );
            api.dispatch(lobbyAuthenticateRequested());
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(authActions.clearAuthTokens());
            const currentPath = window.location?.pathname || '';
            if (
                currentPath !== '/login' &&
                currentPath !== '/register' &&
                currentPath !== '/forgot' &&
                currentPath !== '/reset-password' &&
                currentPath !== '/activate'
            ) {
                window.location.assign('/login');
            }
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: 'rtkApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: Object.values(TAG_TYPES),
    endpoints: (builder) => ({
        getNews: builder.query({
            query: ({ limit } = {}) => ({
                url: '/news',
                params: limit ? { limit } : undefined
            }),
            providesTags: getNewsTags,
            serializeQueryArgs: ({ queryArgs }) => {
                const limit =
                    queryArgs && typeof queryArgs.limit === 'number' ? queryArgs.limit : undefined;
                return limit ? `news-limit-${limit}` : 'news';
            }
        }),
        addNews: builder.mutation({
            query: (text) => ({
                url: '/news',
                method: 'POST',
                body: { text }
            }),
            invalidatesTags: [{ type: TAG_TYPES.NEWS, id: NEWS_LIST_ID }]
        }),
        saveNews: builder.mutation({
            query: ({ id, text }) => ({
                url: `/news/${id}`,
                method: 'PUT',
                body: { text }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: TAG_TYPES.NEWS, id: NEWS_LIST_ID },
                { type: TAG_TYPES.NEWS, id }
            ]
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: TAG_TYPES.NEWS, id: NEWS_LIST_ID },
                { type: TAG_TYPES.NEWS, id }
            ]
        }),
        loginAccount: builder.mutation({
            query: ({ username, password }) => ({
                url: '/account/login',
                method: 'POST',
                body: { username, password }
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        setAuthTokens({
                            token: data.token,
                            refreshToken: data.refreshToken,
                            user: data.user
                        })
                    );
                } catch {
                    // ignore
                }
            }
        }),
        registerAccount: builder.mutation({
            query: ({ username, password, email }) => ({
                url: '/account/register',
                method: 'POST',
                body: { username, password, email }
            })
        }),
        logoutAccount: builder.mutation({
            query: ({ tokenId }) => ({
                url: '/account/logout',
                method: 'POST',
                body: { tokenId }
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(authActions.clearAuthTokens());
                }
            }
        }),
        forgotPassword: builder.mutation({
            query: ({ username, captcha }) => ({
                url: '/account/password-reset',
                method: 'POST',
                body: { username, captcha }
            })
        }),
        resetPassword: builder.mutation({
            query: ({ id, token, newPassword }) => ({
                url: '/account/password-reset-finish',
                method: 'POST',
                body: { id, token, newPassword }
            })
        }),
        activateAccount: builder.mutation({
            query: ({ id, token }) => ({
                url: '/account/activate',
                method: 'POST',
                body: { id, token }
            })
        }),
        verifyAuthentication: builder.mutation({
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
        getCards: builder.query({
            query: () => '/cards',
            providesTags: [{ type: TAG_TYPES.CARDS, id: 'LIST' }]
        }),
        getFactions: builder.query({
            query: () => '/factions',
            providesTags: [{ type: TAG_TYPES.FACTIONS, id: 'LIST' }]
        }),
        getDecks: builder.query({
            query: (options = {}) => ({
                url: '/decks',
                params: {
                    ...options,
                    filter: options.filter ? JSON.stringify(options.filter) : undefined
                }
            }),
            providesTags: [{ type: TAG_TYPES.DECKS, id: DECKS_LIST_ID }]
        }),
        getDeck: builder.query({
            query: (deckId) => `/decks/${deckId}`,
            providesTags: (result, error, deckId) => [{ type: TAG_TYPES.DECKS, id: deckId }]
        }),
        deleteDeck: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: TAG_TYPES.DECKS, id: DECKS_LIST_ID }]
        }),
        saveDeck: builder.mutation({
            query: ({ uuid }) => ({
                url: '/decks/',
                method: 'POST',
                body: { uuid }
            }),
            invalidatesTags: [{ type: TAG_TYPES.DECKS, id: DECKS_LIST_ID }]
        }),
        saveAllianceDeck: builder.mutation({
            query: (deck) => ({
                url: '/decks/alliance',
                method: 'POST',
                body: deck
            }),
            invalidatesTags: [{ type: TAG_TYPES.DECKS, id: DECKS_LIST_ID }]
        }),
        getStandaloneDecks: builder.query({
            query: () => '/standalone-decks',
            providesTags: [{ type: TAG_TYPES.DECKS, id: 'STANDALONE' }]
        }),
        refreshAccolades: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}/refresh-accolades`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, deckId) => [
                { type: TAG_TYPES.DECKS, id: DECKS_LIST_ID },
                { type: TAG_TYPES.DECKS, id: deckId }
            ]
        }),
        updateAccoladeShown: builder.mutation({
            query: ({ deckId, accoladeId, shown }) => ({
                url: `/decks/${deckId}/accolades/${accoladeId}/shown`,
                method: 'POST',
                body: { shown }
            }),
            invalidatesTags: (result, error, { deckId }) => [
                { type: TAG_TYPES.DECKS, id: DECKS_LIST_ID },
                { type: TAG_TYPES.DECKS, id: deckId }
            ]
        }),
        getActiveSessions: builder.query({
            query: (username) => `/account/${username}/sessions`,
            providesTags: [{ type: TAG_TYPES.SESSIONS, id: SESSIONS_ID }]
        }),
        removeSession: builder.mutation({
            query: ({ username, sessionId }) => ({
                url: `/account/${username}/sessions/${sessionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: TAG_TYPES.SESSIONS, id: SESSIONS_ID }]
        }),
        getBlockList: builder.query({
            query: (username) => `/account/${username}/blocklist`,
            providesTags: [{ type: TAG_TYPES.BLOCKLIST, id: BLOCKLIST_ID }]
        }),
        addBlockListEntry: builder.mutation({
            query: ({ username, blockee }) => ({
                url: `/account/${username}/blocklist`,
                method: 'POST',
                body: { username: blockee }
            }),
            invalidatesTags: [{ type: TAG_TYPES.BLOCKLIST, id: BLOCKLIST_ID }]
        }),
        removeBlockListEntry: builder.mutation({
            query: ({ username, blockee }) => ({
                url: `/account/${username}/blocklist/${blockee}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: TAG_TYPES.BLOCKLIST, id: BLOCKLIST_ID }]
        }),
        saveProfile: builder.mutation({
            query: ({ username, details }) => ({
                url: `/account/${username}`,
                method: 'PUT',
                body: { data: details }
            }),
            invalidatesTags: [{ type: TAG_TYPES.USER, id: 'PROFILE' }]
        }),
        deleteAccount: builder.mutation({
            query: ({ username, password }) => ({
                url: `/account/${username}/delete`,
                method: 'POST',
                body: { password }
            })
        }),
        findUser: builder.query({
            query: (username) => `/user/${username}`,
            providesTags: [{ type: TAG_TYPES.ADMIN, id: 'USER' }]
        }),
        saveUser: builder.mutation({
            query: (user) => ({
                url: `/user/${user.username}`,
                method: 'PUT',
                body: { userToChange: user }
            }),
            invalidatesTags: [{ type: TAG_TYPES.ADMIN, id: 'USER' }]
        }),
        verifyDeck: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}/verify`,
                method: 'POST'
            }),
            invalidatesTags: [{ type: TAG_TYPES.ADMIN, id: 'USER' }]
        }),
        verifyAllDecks: builder.mutation({
            query: (username) => ({
                url: `/user/${username}/verifyDecks`,
                method: 'POST'
            }),
            invalidatesTags: [{ type: TAG_TYPES.ADMIN, id: 'USER' }]
        }),
        getBanlist: builder.query({
            query: () => '/banlist/',
            providesTags: [{ type: TAG_TYPES.BANLIST, id: BANLIST_ID }]
        }),
        addBanlist: builder.mutation({
            query: (ip) => ({
                url: '/banlist',
                method: 'POST',
                body: { ip }
            }),
            invalidatesTags: [{ type: TAG_TYPES.BANLIST, id: BANLIST_ID }]
        }),
        deleteBanlist: builder.mutation({
            query: (id) => ({
                url: `/banlist/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: TAG_TYPES.BANLIST, id: BANLIST_ID }]
        }),
        getTournaments: builder.query({
            query: () => '/challonge/tournaments',
            providesTags: [{ type: TAG_TYPES.CHALLONGE, id: CHALLONGE_ID }]
        }),
        getFullTournament: builder.mutation({
            query: (tournamentId) => ({
                url: '/challonge/fullTournament',
                method: 'POST',
                body: { data: tournamentId }
            })
        }),
        getMatches: builder.mutation({
            query: (tournamentId) => ({
                url: '/challonge/matches',
                method: 'POST',
                body: { data: tournamentId }
            })
        }),
        getParticipants: builder.mutation({
            query: (tournamentId) => ({
                url: '/challonge/participants',
                method: 'POST',
                body: { data: tournamentId }
            })
        }),
        attachMatchLink: builder.mutation({
            query: (data) => ({
                url: '/challonge/attachMatchLink',
                method: 'POST',
                body: data
            })
        }),
        getUserGames: builder.query({
            query: () => '/games',
            providesTags: [{ type: TAG_TYPES.GAMES, id: GAMES_ID }]
        }),
        removeLobbyMessage: builder.mutation({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: TAG_TYPES.LOBBY, id: 'MESSAGES' }]
        })
    })
});

export const {
    useGetNewsQuery,
    useAddNewsMutation,
    useSaveNewsMutation,
    useDeleteNewsMutation,
    useLoginAccountMutation,
    useRegisterAccountMutation,
    useLogoutAccountMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useActivateAccountMutation,
    useVerifyAuthenticationMutation,
    useLinkPatreonMutation,
    useUnlinkPatreonMutation,
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetDecksQuery,
    useGetDeckQuery,
    useDeleteDeckMutation,
    useSaveDeckMutation,
    useSaveAllianceDeckMutation,
    useGetStandaloneDecksQuery,
    useRefreshAccoladesMutation,
    useUpdateAccoladeShownMutation,
    useGetActiveSessionsQuery,
    useRemoveSessionMutation,
    useGetBlockListQuery,
    useAddBlockListEntryMutation,
    useRemoveBlockListEntryMutation,
    useSaveProfileMutation,
    useDeleteAccountMutation,
    useFindUserQuery,
    useSaveUserMutation,
    useVerifyDeckMutation,
    useVerifyAllDecksMutation,
    useGetBanlistQuery,
    useAddBanlistMutation,
    useDeleteBanlistMutation,
    useGetTournamentsQuery,
    useGetFullTournamentMutation,
    useGetMatchesMutation,
    useGetParticipantsMutation,
    useAttachMatchLinkMutation,
    useGetUserGamesQuery,
    useRemoveLobbyMessageMutation
} = api;

export default api;
