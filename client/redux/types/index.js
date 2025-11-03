export const Auth = Object.freeze({
    LoginAccount: 'LOGIN_ACCOUNT',
    AccountLoggedIn: 'ACCOUNT_LOGGEDIN'
});

export const Decks = Object.freeze({
    SaveAllianceDeck: 'SAVE_ALLIANCE_DECK',
    AllianceDeckSaved: 'ALLIANCE_DECK_SAVED',
    SaveDeck: 'SAVE_DECK',
    DeckSaved: 'DECK_SAVED',
    DeleteDeck: 'DELETE_DECK',
    DeckDeleted: 'DECK_DELETED',
    RequestDecks: 'REQUEST_DECKS',
    DecksReceived: 'DECKS_RECEIVED',
    SaveProphecyAssignments: 'SAVE_PROPHECY_ASSIGNMENTS',
    ProphecyAssignmentsSaved: 'PROPHECY_ASSIGNMENTS_SAVED'
});

export const Account = Object.freeze({
    ActivateAccount: 'ACTIVATE_ACCOUNT',
    AccountActivated: 'ACCOUNT_ACTIVATED',
    ForgotPasswordRequest: 'FORGOT_PASSWORD_REQUEST',
    ForgotPasswordResponse: 'FORGOT_PASSWORD_RESPONSE'
});

export const Admin = Object.freeze({
    FindUser: 'ADMIN_FINDUSER',
    UserFound: 'ADMIN_USERFOUND',
    SaveUser: 'SAVE_USER',
    UserSaved: 'USER_SAVED'
});

export const News = Object.freeze({
    RequestNews: 'REQUEST_NEWS',
    NewsReceived: 'RECEIVE_NEWS',
    AddNews: 'ADD_NEWS',
    NewsAdded: 'NEWS_ADDED',
    SaveNews: 'SAVE_NEWS',
    NewsSaved: 'NEWS_SAVED',
    DeleteNews: 'DELETE_NEWS',
    NewsDeleted: 'NEWS_DELETED'
});
