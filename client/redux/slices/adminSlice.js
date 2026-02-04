import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';
import { lobbySendMessage } from '../socketActions';

export const clearUserSessions = (username) => (dispatch) => {
    dispatch(lobbySendMessage('clearsessions', username));
};

const adminSlice = createSlice({
    name: 'admin',
    initialState: { banlist: [] },
    reducers: {
        clearUserStatus: (state) => {
            state.userSaved = false;
            state.deckVerified = undefined;
            state.decksVerified = false;
        },
        clearBanlistStatus: (state) => {
            state.banlistAdded = false;
            state.banlistSaved = false;
            state.banlistDeleted = false;
        },
        nodeStatusReceived: (state, action) => {
            state.nodeStatus = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.findUser.matchPending, (state) => {
                state.currentUser = undefined;
            })
            .addMatcher(api.endpoints.findUser.matchFulfilled, (state, action) => {
                const user = action.payload.user;
                if (user) {
                    user.linkedAccounts = action.payload.linkedAccounts;
                }
                state.currentUser = user;
            })
            .addMatcher(api.endpoints.saveUser.matchPending, (state) => {
                state.userSaved = false;
            })
            .addMatcher(api.endpoints.saveUser.matchFulfilled, (state) => {
                state.userSaved = true;
            })
            .addMatcher(api.endpoints.verifyDeck.matchFulfilled, (state, action) => {
                state.deckVerified = action.payload.deckId;
            })
            .addMatcher(api.endpoints.verifyAllDecks.matchFulfilled, (state) => {
                state.decksVerified = true;
            })
            .addMatcher(api.endpoints.getBanlist.matchFulfilled, (state, action) => {
                state.banlist = action.payload.banlist;
            })
            .addMatcher(api.endpoints.addBanlist.matchPending, (state) => {
                state.banlistAdded = false;
            })
            .addMatcher(api.endpoints.addBanlist.matchFulfilled, (state, action) => {
                state.banlistAdded = true;
                state.banlist = [action.payload.entry, ...state.banlist];
            })
            .addMatcher(api.endpoints.deleteBanlist.matchPending, (state) => {
                state.banlistDeleted = false;
            })
            .addMatcher(api.endpoints.deleteBanlist.matchFulfilled, (state, action) => {
                state.banlistDeleted = true;
                state.banlist = state.banlist.filter((entry) => entry.id !== action.payload.id);
            });
    }
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
