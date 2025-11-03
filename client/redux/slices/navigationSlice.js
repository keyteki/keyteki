import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        path: '/',
        search: ''
    },
    reducers: {
        navigate: {
            reducer(state, action) {
                const { newPath, search, noHistory } = action.payload;
                try {
                    if (state.path !== newPath && !noHistory) {
                        window.history.pushState({}, '', newPath + (search || ''));
                    }
                    state.path = newPath;
                    state.search = search || '';
                } catch (err) {
                    // Handle error silently
                }
            },
            prepare(newPath, search, noHistory) {
                return { payload: { newPath, search, noHistory } };
            }
        },
        setUrl(state, action) {
            history.replaceState({}, '', action.payload);
        }
    }
});

export const { navigate, setUrl } = navigationSlice.actions;
export default navigationSlice.reducer;
