import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

const challongeSlice = createSlice({
    name: 'challonge',
    initialState: {
        tournaments: [],
        matches: [],
        participants: [],
        attachments: [],
        message: '',
        success: false
    },
    reducers: {
        clearChallongeMessage: (state) => {
            state.message = '';
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.getTournaments.matchFulfilled, (state, action) => {
                state.message = action.payload.message;
                state.success = action.payload.success;
                state.tournaments = action.payload.data;
            })
            .addMatcher(api.endpoints.getFullTournament.matchFulfilled, (state, action) => {
                state.matches = action.payload.matches;
                state.message = action.payload.message;
                state.participants = action.payload.participants;
                state.success = action.payload.success;
            })
            .addMatcher(api.endpoints.getMatches.matchFulfilled, (state, action) => {
                state.message = action.payload.message;
                state.matches = action.payload.data;
                state.success = action.payload.success;
            })
            .addMatcher(api.endpoints.attachMatchLink.matchFulfilled, (state, action) => {
                state.message = action.payload.message;
                state.success = action.payload.success;
                state.attachments = action.payload.attachments;
            })
            .addMatcher(api.endpoints.getParticipants.matchFulfilled, (state, action) => {
                state.message = action.payload.message;
                state.participants = action.payload.data;
                state.success = action.payload.success;
            });
    }
});

export const challongeActions = challongeSlice.actions;
export default challongeSlice.reducer;
