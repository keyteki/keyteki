import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
    name: 'news',
    initialState: {
        news: []
    },
    reducers: {
        requestNews: () => {
            // No changes needed for request
        },
        newsReceived: (state, action) => {
            state.news = action.payload;
        },
        addNews: (state) => {
            state.newsAdded = false;
        },
        newsAdded: (state, action) => {
            state.news.unshift(action.payload);
            state.newsAdded = true;
        },
        saveNews: (state) => {
            state.newsSaved = false;
        },
        newsSaved: (state, action) => {
            const matchingNews = state.news.find((n) => n.id === parseInt(action.payload.id));
            if (matchingNews) {
                matchingNews.text = action.payload.text;
            }
            state.newsSaved = true;
        },
        deleteNews: (state) => {
            state.newsDeleted = false;
        },
        newsDeleted: (state, action) => {
            state.news = state.news.filter((n) => n.id !== parseInt(action.payload));
            state.newsDeleted = true;
        }
    }
});

export const {
    requestNews,
    newsReceived,
    addNews,
    newsAdded,
    saveNews,
    newsSaved,
    deleteNews,
    newsDeleted
} = newsSlice.actions;

export default newsSlice.reducer;
