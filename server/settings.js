const defaultWindows = {
    plot: false,
    draw: false,
    challengeBegin: false,
    attackersDeclared: true,
    defendersDeclared: true,
    dominance: false,
    standing: false,
    taxation: false
};

const defaultKeywordSettings = {
    chooseOrder: false,
    chooseCards: false
};

const defaultSettings = {
    disableGravatar: false,
    windowTimer: 10,
    background: 'BG1'
};

const defaultTimerSettings = {
    events: true,
    abilities: false
};

function getUserWithDefaultsSet(user) {
    let userToReturn = user;

    if(!userToReturn) {
        return userToReturn;
    }

    userToReturn.settings = Object.assign({}, defaultSettings, userToReturn.settings);
    userToReturn.settings.keywordSettings = Object.assign({}, defaultKeywordSettings, userToReturn.settings.keywordSettings);
    userToReturn.settings.timerSettings = Object.assign({}, defaultTimerSettings, userToReturn.settings.timerSettings);
    userToReturn.permissions = Object.assign({}, userToReturn.permissions);
    userToReturn.promptedActionWindows = Object.assign({}, defaultWindows, userToReturn.promptedActionWindows);
    if(!userToReturn.blockList) {
        userToReturn.blockList = [];
    }

    return userToReturn;
}

module.exports = {
    getUserWithDefaultsSet: getUserWithDefaultsSet
};
