export default function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        const {
            types,
            callAPI,
            shouldCallAPI = () => true,
            payload = {}
        } = action;

        if(!types) {
            return next(action);
        }

        if(!Array.isArray(types) || types.length !== 2 || !types.every(type => typeof type === 'string')) {
            throw new Error('Expected an array of two string types.');
        }

        if(typeof callAPI !== 'function') {
            throw new Error('Expected callAPI to be a function.');
        }

        const [requestType, successType] = types;

        dispatch(Object.assign({}, payload, {
            type: requestType
        }));

        if(!shouldCallAPI(getState())) {
            return;
        }

        dispatch(Object.assign({}, payload, {
            type: 'API_LOADING'
        }));

        return callAPI().then(
            response => {
                if(!response.success) {
                    return dispatch(Object.assign({}, payload, {
                        status: 200,
                        message: response.message,
                        type: 'API_FAILURE'
                    }));
                }

                let ret = dispatch(Object.assign({}, payload, {
                    response,
                    type: successType
                }));

                dispatch(Object.assign({}, payload, {
                    type: 'API_LOADED'
                }));

                return ret;
            },
            error => {
                dispatch(Object.assign({}, payload, {
                    status: error.status,
                    message: 'An error occured communicating with the server.  Please try again later.',
                    type: 'API_LOADED'
                }));

                dispatch(Object.assign({}, payload, {
                    status: error.status,
                    message: 'An error occured communicating with the server.  Please try again later.',
                    type: 'API_FAILURE'
                }));
            }
        );
    };
}

