import { Tags } from '../types';

/**
 * Load all tags for the current user
 */
export function loadTags() {
    return {
        types: [Tags.RequestTags, Tags.TagsReceived],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/tags', cache: false }
    };
}

/**
 * Create a new tag
 * @param {Object} tagData - The tag data { name, color }
 */
export function createTag(tagData) {
    return {
        types: [Tags.CreateTag, Tags.TagCreated],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/tags',
            method: 'POST',
            data: JSON.stringify(tagData),
            cache: false
        }
    };
}

/**
 * Update an existing tag
 * @param {number} tagId - The tag ID
 * @param {Object} tagData - The updated tag data { name, color }
 */
export function updateTag(tagId, tagData) {
    return {
        types: [Tags.UpdateTag, Tags.TagUpdated],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/tags/${tagId}`,
            method: 'PUT',
            data: JSON.stringify(tagData),
            cache: false
        }
    };
}

/**
 * Delete a tag
 * @param {number} tagId - The tag ID
 */
export function deleteTag(tagId) {
    return {
        types: [Tags.DeleteTag, Tags.TagDeleted],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/tags/${tagId}`,
            method: 'DELETE',
            cache: false
        }
    };
}

/**
 * Assign a tag to a deck
 * @param {number} deckId - The deck ID
 * @param {number} tagId - The tag ID
 */
export function assignTagToDeck(deckId, tagId) {
    return {
        types: [Tags.AssignTagToDeck, Tags.TagAssignedToDeck],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deckId}/tags/${tagId}`,
            method: 'POST',
            cache: false
        }
    };
}

/**
 * Remove a tag from a deck
 * @param {number} deckId - The deck ID
 * @param {number} tagId - The tag ID
 */
export function removeTagFromDeck(deckId, tagId) {
    return {
        types: [Tags.RemoveTagFromDeck, Tags.TagRemovedFromDeck],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deckId}/tags/${tagId}`,
            method: 'DELETE',
            cache: false
        }
    };
}

/**
 * Clear tag operation status
 */
export function clearTagStatus() {
    return {
        type: Tags.ClearTagStatus
    };
}
