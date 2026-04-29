import { createSlice } from '@reduxjs/toolkit';

const getStoredAuthState = () => {
    try {
        const token = localStorage.getItem('token');
        const refreshTokenRaw = localStorage.getItem('refreshToken');
        const refreshToken = refreshTokenRaw ? JSON.parse(refreshTokenRaw) : undefined;

        if (!token && !refreshToken) {
            return {};
        }

        return {
            token: token || undefined,
            refreshToken: refreshToken || undefined,
            username: refreshToken?.username
        };
    } catch (error) {
        return {};
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getStoredAuthState(),
    reducers: {
        setAuthTokens: (state, action) => {
            localStorage.setItem('token', action.payload.token);
            if (action.payload.refreshToken) {
                localStorage.setItem('refreshToken', JSON.stringify(action.payload.refreshToken));
            }

            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            if (action.payload.user) {
                state.user = action.payload.user;
                state.username = action.payload.user.username;
            }
        },
        clearAuthTokens: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.token = undefined;
            state.refreshToken = undefined;
            state.user = undefined;
            state.username = undefined;
        }
    }
});

export const authActions = authSlice.actions;
export const { setAuthTokens } = authSlice.actions;
export default authSlice.reducer;
