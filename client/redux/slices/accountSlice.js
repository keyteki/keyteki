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
                state.user = action.payload.user;
            })
            .addMatcher(api.endpoints.linkPatreon.matchFulfilled, (state) => {
                state.accountLinked = true;
            })
            .addMatcher(api.endpoints.unlinkPatreon.matchFulfilled, (state) => {
                state.accountLinked = undefined;
                if (state.user) {
                    state.user.patreon = undefined;
                }
            });
    }
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
