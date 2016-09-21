function connected(socket) {
    return { socket: socket };
}

export default function(state = {}, action) {
    switch(action.type) {
        case 'SOCKET_CONNECTED':
            state = connected(action.socket);
            break;
    }

    return state;
}
