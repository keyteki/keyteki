/* global jasmine */

const _ = require('underscore');
const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');

// Phase values enum
const phaseValue = {
    dynasty: 0,
    draw: 1,
    conflict: 2,
    fate: 3,
    regroup: 4
};
const numPhases = 5;

class GameFlowWrapper {
    constructor() {
        var gameRouter = jasmine.createSpyObj('gameRouter', ['gameWon', 'playerLeft', 'reportError']);
        var details = {
            name: 'player1\'s game',
            id: 12345,
            owner: 'player1',
            saveGameId: 12345,
            players: [
                { id: '111', user: Settings.getUserWithDefaultsSet({ username: 'player1' }) },
                { id: '222', user: Settings.getUserWithDefaultsSet({ username: 'player2' }) }
            ]
        };
        this.game = new Game(details, { router: gameRouter });

        this.player1 = new PlayerInteractionWrapper(this.game, this.game.getPlayerByName('player1'));
        this.player2 = new PlayerInteractionWrapper(this.game, this.game.getPlayerByName('player2'));
        this.player1.player.timerSettings.events = false;
        this.player2.player.timerSettings.events = false;
        this.allPlayers = [this.player1, this.player2];
    }

    get firstPlayer() {
        return _.find(this.allPlayers, player => player.firstPlayer);
    }

    get rings() {
        return this.game.rings;
    }

    eachPlayerInFirstPlayerOrder(handler) {
        var playersInOrder = _.sortBy(this.allPlayers, player => !player.firstPlayer);

        _.each(playersInOrder, player => handler(player));
    }

    /**
     * Executes a function for each player, starting with the one prompted for action
     * @param {Function} handler - function of a player to be executed
     */
    eachPlayerStartingWithPrompted(handler) {
        var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to take an action or pass'));
        _.each(playersInPromptedOrder, player => handler(player));
    }

    startGame() {
        this.game.initialise();
    }

    /**
     * Selects stronghold provinces for both players
     * @param {Object} [strongholds = {}] - names of provinces to select for each player
     * @param {String} strongholds.player1 - stronghold province for player 1
     * @param {String} strongholds.player2 - stronghold province for player 2
     */
    selectStrongholdProvinces(strongholds = {}) {
        this.guardCurrentPhase('setup');
        //Select the fillers, so that province cards specified for province setup aren't used
        this.player1.selectStrongholdProvince(strongholds.player1 || 'shameful-display');
        this.player2.selectStrongholdProvince(strongholds.player2 || 'shameful-display');
    }

    /**
     * Keeps provinces during prompts for dynasty mulligan
     */
    keepDynasty() {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }
    /**
     * Keeps hand during prompt for conflict mulligan
     */
    keepConflict() {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }
    /**
     * Skips setup phase with defaults
     */
    skipSetupPhase() {
        this.selectFirstPlayer(this.player1);
        this.selectStrongholdProvinces();
        this.keepDynasty();
        this.keepConflict();
    }

    /**
     * Both players pass for the rest of the action window
     */
    noMoreActions() {
        if(this.game.currentPhase === 'dynasty') {
            // Players that have already passed aren't prompted again in dynasty
            this.eachPlayerStartingWithPrompted(player => {
                if(!player.player.passedDynasty) {
                    player.clickPrompt('Pass');
                }
            });
        } else {
            this.eachPlayerStartingWithPrompted(player => player.clickPrompt('Pass'));
        }
    }

    /**
     * Skips any remaining conflicts, skips the action window
     */
    finishConflictPhase() {
        this.guardCurrentPhase('conflict');
        while(this.player1.player.getConflictOpportunities() > 0 ||
            this.player2.player.getConflictOpportunities() > 0) {
            try {
                this.noMoreActions();
            } catch(e) {
                // Case: handle skipping a player's conflict
                var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to declare conflict'));
                playersInPromptedOrder[0].clickPrompt('Pass Conflict');
                playersInPromptedOrder[0].clickPrompt('yes');
            }
        }
        this.noMoreActions();
        // Resolve claiming imperial favor, if any
        var claimingPlayer = _.find(this.allPlayers, player => player.hasPrompt('Which side of the Imperial Favor would you like to claim?'));
        if(claimingPlayer) {
            claimingPlayer.clickPrompt('military');
        }
        // this.guardCurrentPhase('fate');
    }

    /**
     * Completes the fate phase
     */
    finishFatePhase() {
        // this.guardCurrentPhase('fate');
        for(let player of this.allPlayers) {
            if(this.player.currentPrompt().menuTitle === 'Fate Phase') {
                player.clickPrompt('Done');
            }
        }
        this.guardCurrentPhase('regroup');
    }

    /**
     * Completes the regroup phase
     */
    finishRegroupPhase() {
        this.guardCurrentPhase('regroup');
        var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to discard dynasty cards'));
        _.each(playersInPromptedOrder, player => player.clickPrompt('Done'));
        // End the round
        var promptedToEnd = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to end the round'));
        _.each(promptedToEnd, player => player.clickPrompt('End Round'));
        this.guardCurrentPhase('dynasty');
    }

    /**
     * Moves to the next phase of the game
     * @return {number} value of phase change.
     * regroup -> dynasty value is 4
     * all other changes is -1
     */
    nextPhase() {
        var phaseChange = 0;
        switch(this.game.currentPhase) {
            case 'setup':
                this.skipSetupPhase();
                break;
            case 'dynasty':
                this.noMoreActions();
                phaseChange = -1;
                break;
            case 'draw':
                this.bidHonor();
                phaseChange = -1;
                break;
            case 'conflict':
                this.finishConflictPhase();
                phaseChange = -1;
                break;
            case 'fate':
                console.log('fate');
                this.finishFatePhase();
                phaseChange = -1;
                break;
            case 'regroup':
                console.log('regroup');
                this.finishRegroupPhase();
                phaseChange = 4; //New turn
                break;
            default:
                break;
        }
        return phaseChange;
    }

    /**
     * Moves through phases, until a certain one is reached
     * @param {String} endphase - phase in which to end
     */
    advancePhases(endphase) {
        if(!endphase) {
            return;
        }

        while(this.game.currentPhase !== endphase) {
            this.nextPhase();
        }
    }

    /**
    *   Executes the honor bidding
    *   @param {?number} player1amt - amount for player1 to bid
    *   @param {?number} player2amt = amount for player2 to bid
    */
    bidHonor(player1amt, player2amt) {
        this.guardCurrentPhase('draw');
        this.player1.bidHonor(player1amt);
        this.player2.bidHonor(player2amt);
        this.guardCurrentPhase('conflict');
    }

    /**
     * Asserts that the game is in the expected phase
     */
    guardCurrentPhase(phase) {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    getPromptedPlayer(title) {
        var promptedPlayer = this.allPlayers.find(p => p.hasPrompt(title));

        if(!promptedPlayer) {
            var promptString = _.map(this.allPlayers, player => player.name + ': ' + player.formatPrompt()).join('\n\n');
            throw new Error(`No players are being prompted with "${title}". Current prompts are:\n\n${promptString}`);
        }

        return promptedPlayer;
    }

    selectFirstPlayer(player) {
        var promptedPlayer = this.getPromptedPlayer('You won the flip. Do you want to be:');
        if(player === promptedPlayer) {
            promptedPlayer.clickPrompt('First Player');
        } else {
            promptedPlayer.clickPrompt('Second Player');
        }
    }

    /**
     * Get an array of the latest chat messages
     * @param {Number} numBack - number of messages back from the latest to retrieve
     * @param {Boolean} reverse - reverse the retrieved elements so the array is easily read when printed
     */
    getChatLogs(numBack = 1, reverse = true) {
        let results = [];
        for(let i = 0; i < this.game.messages.length && i < numBack; i++) {
            let result = '';
            let chatMessage = this.game.messages[this.game.messages.length - i - 1];
            for(let j = 0; j < chatMessage.message.length; j++) {
                result += getChatString(chatMessage.message[j]);
            }
            results.push(result);
        }

        return reverse ? results.reverse() : results;

        function getChatString(item) {
            if(Array.isArray(item)) {
                return item.map(arrItem => getChatString(arrItem)).join('');
            } else if(item instanceof Object) {
                if(item.name) {
                    return item.name;
                } else if(item.message) {
                    return getChatString(item.message);
                }
            }
            return item;
        }
    }

    /**
     * Get specified chat message or nothing
     * @param {Number} numBack - How far back you want to get a message, defaults to the latest chat message
     */
    getChatLog(numBack = 0) {
        let messages = this.getChatLogs(numBack + 1, false);
        return messages.length && messages[numBack] ? messages[numBack] : '<No Message Found>';
    }
}

module.exports = GameFlowWrapper;
