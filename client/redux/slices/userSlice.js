import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

const userSlice = createSlice({
    name: 'user',
    initialState: { blockList: [] },
    reducers: {
        clearBlockListStatus: (state) => {
            state.blockListAdded = false;
            state.blockListDeleted = false;
        },
        clearSessionStatus: (state) => {
            state.sessionRemoved = false;
        },
        clearProfileStatus: (state) => {
            state.profileSaved = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.getBlockList.matchFulfilled, (state, action) => {
                state.blockList = action.payload.blockList;
            })
            .addMatcher(api.endpoints.getActiveSessions.matchFulfilled, (state, action) => {
                state.sessions = action.payload.tokens;
            })
            .addMatcher(api.endpoints.removeSession.matchPending, (state) => {
                state.sessionRemoved = false;
            })
            .addMatcher(api.endpoints.removeSession.matchFulfilled, (state, action) => {
                state.sessionRemoved = true;
                if (state.sessions) {
                    state.sessions = state.sessions.filter((t) => t.id !== action.payload.tokenId);
                }
            })
            .addMatcher(api.endpoints.addBlockListEntry.matchFulfilled, (state, action) => {
                state.blockListAdded = true;
                if (state.blockList) {
                    state.blockList.push(action.payload.username);
                }
            })
            .addMatcher(api.endpoints.removeBlockListEntry.matchFulfilled, (state, action) => {
                state.blockListDeleted = true;
                state.blockList = state.blockList.filter(
                    (user) => user !== action.payload.username
                );
            })
            .addMatcher(api.endpoints.saveProfile.matchPending, (state) => {
                state.profileSaved = false;
            })
            .addMatcher(api.endpoints.saveProfile.matchFulfilled, (state) => {
                state.profileSaved = true;
            });
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
