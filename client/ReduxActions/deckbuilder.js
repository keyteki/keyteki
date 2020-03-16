import $ from 'jquery'

const apiRoutes = {
    "createDeckBuilder": "/api/decks/builder",
    "addCardToBuilder" : "/api/decks/builder/"
}

function buildRestPath(route) {
    if (route in apiRoutes) {
        return 'http://' + location.host + apiRoutes[route];
    }
    return '';
}

function buildAuthorizationHeaders() {
    return { 'Authorization': 'bearer ' + localStorage.token };
}
export function createDeckBuilder(successCallback, errorCallback) {
    var url = buildRestPath("createDeckBuilder"); 
    $.ajax({
        url: url,
        type: 'POST',
        headers: buildAuthorizationHeaders(),
        success: successCallback,
        error: errorCallback
    });

    return {
        type: 'BUILDER_CREATE',
        shouldCallAPI: () => true,
        APIParams: {
            url: apiRoutes['createDeckBuilder'],
            type: 'POST',
            data: {},
            contentType: 'application/json'
        }
    };
}

export function addCardToBuilder(cardId, successCallback, errorCallback) {
    var url = buildRestPath("addCardToBuilder"); 
    $.ajax({
        url: url + cardId,
        type: 'PATCH',
        headers: buildAuthorizationHeaders(),
        success: successCallback,
        error: errorCallback
    });

    return {
        type: 'BUILDER_ADD',
        shouldCallAPI: () => true,
        APIParams: {
            url: apiRoutes['addCardToBuilder'] + cardId,
            type: 'PATCH',
            data: {},
            contentType: 'application/json'
        }
    };
}

