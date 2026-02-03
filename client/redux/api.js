import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAG_TYPES } from './apiTags';

const NEWS_LIST_ID = 'LIST';
const getNewsTags = (result) => {
    const items = result?.news || [];
    return [
        { type: TAG_TYPES.NEWS, id: NEWS_LIST_ID },
        ...items.map((item) => ({ type: TAG_TYPES.NEWS, id: item.id }))
    ];
};

export const api = createApi({
    reducerPath: 'rtkApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: [TAG_TYPES.NEWS],
    endpoints: (builder) => ({
        getNews: builder.query({
            query: ({ limit } = {}) => ({
                url: '/news',
                params: limit ? { limit } : undefined
            }),
            providesTags: getNewsTags,
            serializeQueryArgs: ({ queryArgs }) => {
                const limit =
                    queryArgs && typeof queryArgs.limit === 'number' ? queryArgs.limit : undefined;
                return limit ? `news-limit-${limit}` : 'news';
            }
        }),
        addNews: builder.mutation({
            query: (text) => ({
                url: '/news',
                method: 'POST',
                body: { text }
            }),
            invalidatesTags: [{ type: TAG_TYPES.NEWS, id: NEWS_LIST_ID }]
        }),
        saveNews: builder.mutation({
            query: ({ id, text }) => ({
                url: `/news/${id}`,
                method: 'PUT',
                body: { text }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: TAG_TYPES.NEWS, id: NEWS_LIST_ID },
                { type: TAG_TYPES.NEWS, id }
            ]
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: TAG_TYPES.NEWS, id: NEWS_LIST_ID },
                { type: TAG_TYPES.NEWS, id }
            ]
        })
    })
});

export const { useGetNewsQuery, useAddNewsMutation, useSaveNewsMutation, useDeleteNewsMutation } =
    api;

export default api;
