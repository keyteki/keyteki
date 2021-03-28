const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');

class GameFlowWrapper {
    constructor(cards) {
        var gameRouter = jasmine.createSpyObj('gameRouter', [
            'gameWon',
            'playerLeft',
            'handleError'
        ]);
        gameRouter.handleError.and.callFake((game, error) => {
            throw error;
        });
        var details = {
            name: "player1's game",
            id: 12345,
            owner: 'player1',
            saveGameId: 12345,
            players: [
                {
                    id: '111',
                    user: Settings.getUserWithDefaultsSet({
                        username: 'player1',
                        settings: { optionSettings: { orderForcedAbilities: true } }
                    })
                },
                {
                    id: '222',
                    user: Settings.getUserWithDefaultsSet({
                        username: 'player2',
                        settings: { optionSettings: { orderForcedAbilities: true } }
                    })
                }
            ]
        };
        this.game = new Game(details, { router: gameRouter, cardData: cards });
        this.game.started = true;

        this.player1 = new PlayerInteractionWrapper(
            this.game,
            this.game.getPlayerByName('player1')
        );
        this.player2 = new PlayerInteractionWrapper(
            this.game,
            this.game.getPlayerByName('player2')
        );
        this.allPlayers = [this.player1, this.player2];
    }

    get activePlayer() {
        return this.game.activePlayer;
    }

    startGame() {
        this.game.initialise();
        this.game.activePlayer = this.player1.player;
        this.player1.clickPrompt('Start the Game');
        this.player2.clickPrompt('Start the Game');
    }

    /**
     * Keeps hand during prompt for conflict mulligan
     */
    keepCards() {
        this.guardCurrentPhase('setup');
        this.player1.clickPrompt('Keep Hand');
        this.player2.clickPrompt('Keep Hand');
    }

    /**
     * Asserts that the game is in the expected phase
     */
    guardCurrentPhase(phase) {
        if (this.game.currentPhase !== phase) {
            throw new Error(
                `Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`
            );
        }
    }

    /**
     * Get an array of the latest chat messages
     * @param {Number} numBack - number of messages back from the latest to retrieve
     * @param {Boolean} reverse - reverse the retrieved elements so the array is easily read when printed
     */
    getChatLogs(numBack = 1, reverse = true) {
        let results = [];
        for (let i = 0; i < this.game.messages.length && i < numBack; i++) {
            let result = '';
            let chatMessage = this.game.messages[this.game.messages.length - i - 1];
            for (let j = 0; j < chatMessage.message.length; j++) {
                result += getChatString(chatMessage.message[j]);
            }

            results.push(result);
        }

        return reverse ? results.reverse() : results;

        function getChatString(item) {
            if (Array.isArray(item)) {
                return item.map((arrItem) => getChatString(arrItem)).join('');
            } else if (item instanceof Object) {
                if (item.name) {
                    return item.name;
                } else if (item.message) {
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
