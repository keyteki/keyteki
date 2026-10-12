import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

const accountSlice = createSlice({
    name: 'account',
    initialState: {},
    reducers: {
        clearLinkStatus: (state) => {
            state.accountLinked = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.registerAccount.matchPending, (state) => {
                state.registered = false;
            })
            .addMatcher(api.endpoints.registerAccount.matchFulfilled, (state) => {
                state.registered = true;
            })
            .addMatcher(api.endpoints.loginAccount.matchPending, (state) => {
                state.loggedIn = false;
            })
            .addMatcher(api.endpoints.loginAccount.matchFulfilled, (state, action) => {
                state.loggedIn = true;
                state.loggedOut = false;
                state.user = action.payload.user;
            })
            .addMatcher(api.endpoints.logoutAccount.matchFulfilled, (state) => {
                state.loggedIn = false;
                state.loggedOut = true;
                state.user = undefined;
            })
            .addMatcher(api.endpoints.resetPassword.matchPending, (state) => {
                state.passwordReset = false;
            })
            .addMatcher(api.endpoints.resetPassword.matchFulfilled, (state) => {
                state.passwordReset = true;
            })
            .addMatcher(api.endpoints.activateAccount.matchPending, (state) => {
                state.activated = false;
            })
            .addMatcher(api.endpoints.activateAccount.matchFulfilled, (state) => {
                state.activated = true;
            })
            .addMatcher(api.endpoints.verifyAuthentication.matchFulfilled, (state, action) => {
                state.loggedIn = true;
                state.user = action.payload.user;
            })
            .addMatcher(api.endpoints.saveProfile.matchFulfilled, (state, action) => {
                // The saved user doesn't include the patreon status, that only comes from checkauth
                state.user = { ...action.payload.user, patreon: state.user?.patreon };
            })
            .addMatcher(api.endpoints.deleteAccount.matchFulfilled, (state) => {
                state.loggedIn = false;
                state.loggedOut = true;
                state.user = undefined;
            })
            .addMatcher(api.endpoints.linkPatreon.matchFulfilled, (state, action) => {
                state.accountLinked = true;
                if (state.user) {
                    state.user.patreon = action.payload.patreon;
                    state.user.permissions = {
                        ...state.user.permissions,
                        isSupporter: action.payload.isSupporter
                    };
                }
            })
            .addMatcher(api.endpoints.unlinkPatreon.matchFulfilled, (state, action) => {
                state.accountLinked = undefined;
                if (state.user) {
                    state.user.patreon = undefined;
                    state.user.permissions = {
                        ...state.user.permissions,
                        isSupporter: action.payload.isSupporter
                    };
                }
            });
    }
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
