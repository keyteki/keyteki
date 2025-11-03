import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
    name: 'account',
    initialState: {},
    reducers: {
        registerAccount: (state) => {
            state.registered = false;
        },
        accountRegistered: (state) => {
            state.registered = true;
        },
        loginAccount: (state) => {
            state.loggedIn = false;
        },
        accountLoggedIn: (state, action) => {
            state.loggedIn = true;
            state.user = action.payload.user;
        },
        accountLoggedOut: (state) => {
            state.loggedIn = false;
            state.loggedOut = true;
            state.user = undefined;
        },
        resetPasswordAccount: (state) => {
            state.passwordReset = false;
        },
        accountPasswordReset: (state) => {
            state.passwordReset = true;
        },
        activateAccount: (state) => {
            state.activated = false;
        },
        accountActivated: (state) => {
            state.activated = true;
        },
        accountAuthVerified: (state, action) => {
            state.loggedIn = true;
            state.user = action.payload.user;
        },
        profileSaved: (state, action) => {
            state.user = action.payload.user;
        },
        accountLinkResponse: (state) => {
            state.accountLinked = true;
        },
        clearLinkStatus: (state) => {
            state.accountLinked = undefined;
        },
        accountUnlinked: (state) => {
            if (state.user) {
                state.user.patreon = undefined;
            }
            state.accountLinked = undefined;
        }
    }
});

export const {
    registerAccount,
    accountRegistered,
    loginAccount,
    accountLoggedIn,
    accountLoggedOut,
    resetPasswordAccount,
    accountPasswordReset,
    activateAccount,
    accountActivated,
    accountAuthVerified,
    profileSaved,
    accountLinkResponse,
    clearLinkStatus,
    accountUnlinked
} = accountSlice.actions;

export default accountSlice.reducer;
