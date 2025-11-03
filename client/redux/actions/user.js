// Re-export RTK Query hooks as action creators for backward compatibility
export {
    useLoadActiveSessionsQuery,
    useRemoveSessionMutation,
    useLoadBlocklistQuery as loadBlockList,
    useAddBlocklistEntryMutation as addBlockListEntry,
    useRemoveBlocklistEntryMutation as removeBlockListEntry,
    useSaveProfileMutation as saveProfile
} from '../slices/apiSlice';

// Keep legacy actions that don't have RTK Query equivalents yet
export function clearBlockListStatus() {
    // Legacy stub - blocklist managed by RTK Query now
    return {
        type: 'CLEAR_BLOCKLIST_STATUS'
    };
}

export function clearSessionStatus() {
    // Legacy stub - sessions managed by RTK Query now
    return {
        type: 'CLEAR_SESSION_STATUS'
    };
}

export function clearProfileStatus() {
    // Legacy stub - profile managed by RTK Query now
    return {
        type: 'CLEAR_PROFILE_STATUS'
    };
}
