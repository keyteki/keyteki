/**
 * The commands a client is allowed to send to a game. The game server only dispatches
 * messages to methods defined on this class, so anything added here is callable by any
 * connected player or spectator. Each command receives the sending user's name first.
 */
class GameCommands {
    /**
     * @param {import('./game')} game
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * @param {string} command
     * @returns {boolean}
     */
    static isCommand(command) {
        return (
            typeof command === 'string' &&
            command !== 'constructor' &&
            Object.hasOwn(GameCommands.prototype, command) &&
            typeof GameCommands.prototype[command] === 'function'
        );
    }

    cardClicked(playerName, cardId) {
        return this.game.cardClicked(playerName, cardId);
    }

    changeActiveHouse(playerName, house) {
        if (!this.game.manualMode) {
            return;
        }

        return this.game.changeActiveHouse(playerName, house);
    }

    changeStat(playerName, stat, value) {
        if (!this.game.manualMode) {
            return;
        }

        return this.game.changeStat(playerName, stat, value);
    }

    chat(playerName, message) {
        return this.game.chat(playerName, message);
    }

    clickProphecy(playerName, prophecyCardId) {
        return this.game.clickProphecy(playerName, prophecyCardId);
    }

    clickTide(playerName) {
        return this.game.clickTide(playerName);
    }

    concede(playerName) {
        return this.game.concede(playerName);
    }

    drop(playerName, cardId, source, target) {
        return this.game.drop(playerName, cardId, source, target);
    }

    forcePass(playerName) {
        return this.game.forcePass(playerName);
    }

    menuButton(playerName, arg, uuid, method) {
        return this.game.menuButton(playerName, arg, uuid, method);
    }

    menuItemClick(playerName, cardId, menuItem) {
        return this.game.menuItemClick(playerName, cardId, menuItem);
    }

    modifyKey(playerName, color, forged) {
        if (!this.game.manualMode) {
            return;
        }

        return this.game.modifyKey(playerName, color, forged);
    }

    shuffleDeck(playerName) {
        return this.game.shuffleDeck(playerName);
    }

    toggleManualMode(playerName) {
        return this.game.toggleManualMode(playerName);
    }

    toggleMuteSpectators(playerName) {
        return this.game.toggleMuteSpectators(playerName);
    }

    toggleOptionSetting(playerName, settingName, toggle) {
        return this.game.toggleOptionSetting(playerName, settingName, toggle);
    }
}

module.exports = GameCommands;
