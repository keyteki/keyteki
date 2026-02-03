export default function (state = { path: '/' }, action) {
    switch (action.type) {
        case 'NAVIGATE':
            return { path: action.newPath, search: action.search };
        case 'SET_URL':
            return { ...state, path: action.path };
        default:
            return state;
    }
}
