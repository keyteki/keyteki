function navigate(state, newPath) {
    window.history.pushState({}, '', newPath);
    return { path: newPath };
}

export default function(state = {}, action) {
    switch(action.type) {
        case 'NAVIGATE':
            state = navigate(state, action.newPath);
            break;
    }

    return state;
}
