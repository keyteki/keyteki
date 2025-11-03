import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        banlist: []
    },
    reducers: {
        findUser: (state) => {
            state.currentUser = undefined;
        },
        userFound: (state, action) => {
            const user = action.payload.user;
            if (user) {
                user.linkedAccounts = action.payload.linkedAccounts;
            }
            state.currentUser = user;
        },
        saveUser: (state) => {
            state.userSaved = false;
        },
        userSaved: (state) => {
            state.userSaved = true;
        },
        deckVerified: (state, action) => {
            state.deckVerified = action.payload;
        },
        decksVerified: (state) => {
            state.decksVerified = true;
        },
        clearUserStatus: (state) => {
            state.userSaved = false;
            state.deckVerified = undefined;
            state.decksVerified = false;
        },
        nodeStatusReceived: (state, action) => {
            state.nodeStatus = action.payload;
        },
        requestBanlist: () => {
            // No changes needed for request
        },
        receiveBanlist: (state, action) => {
            state.banlist = action.payload;
        },
        addBanlist: (state) => {
            state.banlistAdded = false;
        },
        banlistAdded: (state, action) => {
            state.banlistAdded = true;
            state.banlist = [action.payload, ...state.banlist];
        },
        deleteBanlist: (state) => {
            state.banlistDeleted = false;
        },
        banlistDeleted: (state, action) => {
            state.banlistDeleted = true;
            state.banlist = state.banlist.filter((entry) => entry.id !== action.payload);
        },
        clearBanlistStatus: (state) => {
            state.banlistAdded = false;
            state.banlistSaved = false;
            state.banlistDeleted = false;
        }
    }
});

export const {
    findUser,
    userFound,
    saveUser,
    userSaved,
    deckVerified,
    decksVerified,
    clearUserStatus,
    nodeStatusReceived,
    requestBanlist,
    receiveBanlist,
    addBanlist,
    banlistAdded,
    deleteBanlist,
    banlistDeleted,
    clearBanlistStatus
} = adminSlice.actions;

export default adminSlice.reducer;
