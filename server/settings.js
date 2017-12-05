const defaultWindows = {
    dynasty: true,
    draw: false,
    preConflict: true,
    conflict: true,
    fate: false,
    regroup: false
};

const defaultOptionSettings = {
    markCardsUnselectable: true,
    cancelOwnAbilities: false,
    showStatusInSidebar: false
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
    userToReturn.settings.optionSettings = Object.assign({}, defaultOptionSettings, userToReturn.settings.optionSettings);
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
