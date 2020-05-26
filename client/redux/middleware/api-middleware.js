import $ from 'jquery';
import { navigate, setAuthTokens, authenticateSocket } from '../actions';
import { Api } from '../types';

export default function callAPIMiddleware({ dispatch, getState }) {
    return (next) => async (action) => {
        const {
            types,
            APIParams,
            shouldCallAPI = () => true,
            payload = {},
            skipAuth = false
        } = action;

        if (!types) {
            return next(action);
        }

        if (
            !Array.isArray(types) ||
            types.length !== 2 ||
            !types.every((type) => typeof type === 'string')
        ) {
            throw new Error('Expected an array of two string types.');
        }

        const [requestType, successType] = types;

        dispatch(
            Object.assign({}, payload, {
                type: requestType
            })
        );

        if (!shouldCallAPI(getState())) {
            return;
        }

        dispatch(
            Object.assign({}, payload, {
                type: Api.ApiLoading,
                request: requestType
            })
        );

        let apiParams = APIParams || {};
        apiParams.contentType = 'application/json';
        if (!skipAuth) {
            apiParams.headers = {
                Authorization: `Bearer ${getState().auth.token}`
            };
        }

        let response;
        let errorStatus = 200;

        try {
            response = await $.ajax(apiParams.url, apiParams);
        } catch (error) {
            if (error.status === 401) {
                let state = getState();
                let authResponse = await $.ajax('/api/account/token', {
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify({ token: state.auth.refreshToken })
                });

                if (!authResponse.success) {
                    dispatch(navigate('/login'));

                    return;
                }

                dispatch(
                    setAuthTokens(authResponse.token, state.auth.refreshToken, authResponse.user)
                );
                dispatch(authenticateSocket());

                apiParams.headers = {
                    Authorization: `Bearer ${authResponse.token}`
                };

                try {
                    response = await $.ajax(apiParams.url, apiParams);
                } catch (innerError) {
                    errorStatus = innerError.status;
                }
            } else {
                errorStatus = error.status;
            }
        }

        if (!response) {
            dispatch(
                Object.assign({}, payload, {
                    status: errorStatus,
                    message:
                        'An error occured communicating with the server.  Please try again later.',
                    type: Api.ApiLoaded,
                    request: requestType
                })
            );

            dispatch(
                Object.assign({}, payload, {
                    status: errorStatus,
                    message:
                        'An error occured communicating with the server.  Please try again later.',
                    type: Api.ApiFailure,
                    request: requestType
                })
            );

            return;
        }

        if (!response.success) {
            dispatch(
                Object.assign({}, payload, {
                    status: 200,
                    message: response.message,
                    type: Api.ApiFailure,
                    request: requestType
                })
            );

            return;
        }

        dispatch(
            Object.assign({}, payload, {
                response,
                type: successType
            })
        );

        dispatch(
            Object.assign({}, payload, {
                type: Api.ApiLoaded,
                request: requestType
            })
        );
    };
}
