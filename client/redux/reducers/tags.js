import { Tags } from '../types';

const initialState = {
    tags: [],
    loading: false,
    tagCreated: false,
    tagUpdated: false,
    tagDeleted: false,
    tagAssigned: false,
    tagRemoved: false
};

export default function (state = initialState, action) {
    let newState;

    switch (action.type) {
        case Tags.RequestTags:
            return Object.assign({}, state, {
                loading: true
            });

        case Tags.TagsReceived:
            return Object.assign({}, state, {
                loading: false,
                tags: action.response.tags || []
            });

        case Tags.CreateTag:
            return Object.assign({}, state, {
                loading: true,
                tagCreated: false
            });

        case Tags.TagCreated:
            newState = Object.assign({}, state, {
                loading: false,
                tagCreated: true
            });

            if (action.response.tag) {
                newState.tags = [...state.tags, action.response.tag];
            }

            return newState;

        case Tags.UpdateTag:
            return Object.assign({}, state, {
                loading: true,
                tagUpdated: false
            });

        case Tags.TagUpdated:
            newState = Object.assign({}, state, {
                loading: false,
                tagUpdated: true
            });

            if (action.response.tag) {
                newState.tags = state.tags.map((tag) =>
                    tag.id === action.response.tag.id ? action.response.tag : tag
                );
            }

            return newState;

        case Tags.DeleteTag:
            return Object.assign({}, state, {
                loading: true,
                tagDeleted: false
            });

        case Tags.TagDeleted:
            newState = Object.assign({}, state, {
                loading: false,
                tagDeleted: true
            });

            return newState;

        case Tags.AssignTagToDeck:
            return Object.assign({}, state, {
                loading: true,
                tagAssigned: false
            });

        case Tags.TagAssignedToDeck:
            return Object.assign({}, state, {
                loading: false,
                tagAssigned: true
            });

        case Tags.RemoveTagFromDeck:
            return Object.assign({}, state, {
                loading: true,
                tagRemoved: false
            });

        case Tags.TagRemovedFromDeck:
            return Object.assign({}, state, {
                loading: false,
                tagRemoved: true
            });

        case Tags.ClearTagStatus:
            return Object.assign({}, state, {
                tagCreated: false,
                tagUpdated: false,
                tagDeleted: false,
                tagAssigned: false,
                tagRemoved: false
            });

        default:
            return state;
    }
}
