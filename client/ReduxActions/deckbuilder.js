import $ from 'jquery'

const apiRoute = "/api/deckbuilder";

export function createDeckBuilder(successCallback, errorCallback) {
    makeRequest('PUT', successCallback, errorCallback);

    return { type: 'DEFFERED' };
}

export function addCardToBuilder(cardId, successCallback, errorCallback) {
    makeRequest('PATCH', successCallback, errorCallback, {cardId: cardId});

    return { type: 'DEFFERED' };
}

export function removeCardFromBuilder(cardId, count, successCallback, errorCallback) {
    makeRequest('DELETE', successCallback, errorCallback, {cardId: cardId, count: count});

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

function makeRequest(type, successCallback, errorCallback, body = {}) {
    $.ajax({
        url: buildRestPath(),
        type: type,
        headers: buildAuthorizationHeaders(),
        success: successCallback,
        error: errorCallback,
        data: body
    });
}

function buildRestPath() {
    return 'http://' + location.host + apiRoute;
}

function buildAuthorizationHeaders() {
    return { 'Authorization': 'bearer ' + localStorage.token };
}