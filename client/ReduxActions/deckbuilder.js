import $ from 'jquery'

const apiRoute = "/api/deckbuilder";

export function createDeckBuilder(successCallback, errorCallback) {
    makeRequest('PUT', successCallback, errorCallback);

    return { type: 'DEFFERED' };
}

export function addCardToBuilder(cardId, successCallback, errorCallback) {
    makeRequest('PATCH', successCallback, errorCallback, '/' + cardId);

    return { type: 'DEFFERED' };
}

export function getBuilderDeck(successCallback, errorCallback) {
    makeRequest('GET', successCallback, errorCallback);

    return { type: 'DEFFERED' };
}

export function saveBuilderDeck(successCallback, errorCallback) {
    makeRequest('POST', successCallback, errorCallback);
    
    return { type: 'DEFFERED' };
}

function makeRequest(type, successCallback, errorCallback, complementaryUrl = '') {
    var url = buildRestPath() + complementaryUrl;
    $.ajax({
        url: url,
        type: type,
        headers: buildAuthorizationHeaders(),
        success: successCallback,
        error: errorCallback
    });
}

function buildRestPath() {
    return 'http://' + location.host + apiRoute;
}

function buildAuthorizationHeaders() {
    return { 'Authorization': 'bearer ' + localStorage.token };
}