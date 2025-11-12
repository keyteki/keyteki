import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: undefined,
    refreshToken: undefined,
    user: undefined,
    username: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: (create) => ({
        profileSaved(state, action) {
            state.token = action.payload.response.token;
        },
        blocklistAdded(state, action) {
            state.user = action.payload.response.user;
            state.username = action.payload.response.user.username;
        },
        blocklistDeleted(state, action) {
            state.user = action.payload.response.user;
            state.username = action.payload.response.user.username;
        },
        accountLoggedIn: create.preparedReducer(
            (user, token, refreshToken) => {
                return { payload: { user, token, refreshToken } };
            },
            (state, action) => {
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('refreshToken', JSON.stringify(action.payload.refreshToken));

                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.user = action.payload.user;
            }
        ),
        accountLoggedOut(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.token = undefined;
            state.refreshToken = undefined;
            state.user = undefined;
        },
        setAuthTokens: create.preparedReducer(
            (token, refreshToken) => {
                return { payload: { token, refreshToken } };
            },
            (state, action) => {
                localStorage.setItem('token', action.payload.token);
                if (action.payload.refreshToken) {
                    localStorage.setItem(
                        'refreshToken',
                        JSON.stringify(action.payload.refreshToken)
                    );
                }
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            }
        ),
        setUser(state, action) {
            state.user = action.payload;
        }
    })
});

export const {
    profileSaved,
    blocklistAdded,
    blocklistDeleted,
    accountLoggedIn,
    accountLoggedOut,
    setAuthTokens,
    setUser
} = authSlice.actions;

export default authSlice.reducer;
