function navigate(state, newPath, search) {
    window.history.pushState({}, '', newPath + (search || ''));
    return { path: newPath, search: search };
}

export default function(state = {}, action) {
    switch(action.type) {
        case 'NAVIGATE':
            state = navigate(state, action.newPath, action.search);
            break;
        case 'SET_CONTEXT_MENU':
            state = Object.assign({}, state, {
                context: action.menu
            });
            break;
    }

    return state;
}
