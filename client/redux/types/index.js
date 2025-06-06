export const Auth = Object.freeze({
    LoginAccount: 'LOGIN_ACCOUNT',
    AccountLoggedIn: 'ACCOUNT_LOGGEDIN'
});

export const Api = Object.freeze({
    ApiFailure: 'API_FAILURE',
    ApiLoaded: 'API_LOADED',
    ApiLoading: 'API_LOADING',
    ClearApiStatus: 'CLEAR_API_STATUS'
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

export const UserAction = Object.freeze({
    RequestBlocklist: 'REQUEST_BLOCKLIST',
    ReceiveBlocklist: 'RECEIVE_BLOCKLIST',
    AddBlocklist: 'ADD_BLOCKLIST',
    BlocklistAdded: 'BLOCKLIST_ADDED',
    DeleteBlockList: 'DELETE_BLOCKLIST',
    BlocklistDeleted: 'BLOCKLIST_DELETED'
});

export const Account = Object.freeze({
    ActivateAccount: 'ACTIVATE_ACCOUNT',
    AccountActivated: 'ACCOUNT_ACTIVATED',
    ForgotPasswordRequest: 'FORGOT_PASSWORD_REQUEST',
    ForgotPasswordResponse: 'FORGOT_PASSWORD_RESPONSE'
});

export const Challonge = Object.freeze({
    RequestTournaments: 'REQUEST_TOURNAMENTS',
    RecevieTournaments: 'RECEIVE_TOURNAMENTS',
    RequestFullTournament: 'REQUEST_FULL_TOURNAMENT',
    ReceiveFullTournament: 'RECEIVE_FULL_TOURNAMENT',
    RequestMatches: 'REQUEST_MATCHES',
    ReceiveMatches: 'RECEIVE_MATCHES',
    RequestParticipants: 'REQUEST_PARTICIPANTS',
    ReceiveParticipants: 'RECEIVE_PARTICIPANTS',
    CreateAttachments: 'CREATE_ATTACHMENTS',
    ReceiveAttachments: 'RECEIVE_ATTACHMENTS',
    ClearMessage: 'CLEAR_CHALLONGE_MESSAGE'
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
