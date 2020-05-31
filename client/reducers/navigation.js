function navigate(state, newPath, search, noHistory) {
    try {
        if (state.path !== newPath && !noHistory) {
            window.history.pushState({}, '', newPath + (search || ''));
        }

        return { path: newPath, search: search };
    } catch (err) {
        return {};
    }
}

export default function (state = { path: '/' }, action) {
    switch (action.type) {
        case 'NAVIGATE':
            state = navigate(state, action.newPath, action.search, action.noHistory);
            break;
        case 'SET_CONTEXT_MENU':
            state = Object.assign({}, state, {
                context: action.menu
            });
            break;
        case 'SET_URL':
            history.replaceState({}, '', action.path);
            break;
    }

    return state;
}
