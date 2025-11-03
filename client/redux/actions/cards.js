// @ts-nocheck
import { api } from '../slices/apiSlice';

// Re-export RTK Query hooks
export const { useLoadCardsQuery, useLoadFactionsQuery } = api;

// Legacy action creators converted to dispatch RTK Query hooks
export function loadCards() {
    return (dispatch) => {
        dispatch(api.endpoints.loadCards.initiate());
    };
}

export function loadFactions() {
    return (dispatch) => {
        dispatch(api.endpoints.loadFactions.initiate());
    };
}
