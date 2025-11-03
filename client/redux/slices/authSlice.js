import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: undefined,
        refreshToken: undefined,
        user: undefined
    },
    reducers: {
        setAuthTokens: {
            reducer(state, action) {
                const { token, refreshToken, user } = action.payload;
                localStorage.setItem('token', token);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
                }
                state.token = token;
                state.refreshToken = refreshToken;
                if (user) {
                    state.user = user;
                }
            },
            prepare(token, refreshToken, user) {
                return { payload: { token, refreshToken, user } };
            }
        },
        accountLoggedIn(state, action) {
            const { token, refreshToken } = action.payload.response;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
            state.token = token;
            state.refreshToken = refreshToken;
        },
        accountLoggedOut(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.token = undefined;
            state.refreshToken = undefined;
        },
        profileSaved(state, action) {
            state.token = action.payload.response.token;
        },
        blocklistUpdated(state, action) {
            state.user = action.payload.response.user;
            state.username = action.payload.response.user.username;
        }
    }
});

export const {
    setAuthTokens,
    accountLoggedIn,
    accountLoggedOut,
    profileSaved,
    blocklistUpdated
} = authSlice.actions;

export default authSlice.reducer;
