/* global jasmine */

const _ = require('underscore');

const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');

class GameFlowWrapper {
    constructor() {
        var gameRouter = jasmine.createSpyObj('gameRouter', ['gameWon', 'playerLeft']);
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
        this.allPlayers = [this.player1, this.player2];
    }

    eachPlayerInFirstPlayerOrder(handler) {
        var playersInOrder = _.sortBy(this.allPlayers, player => !player.firstPlayer);

        _.each(playersInOrder, player => handler(player));
    }

    startGame() {
        this.game.initialise();
    }

    keepStartingHands() {
        _.each(this.allPlayers, player => player.clickPrompt('Keep Hand'));
    }

    skipSetupPhase() {
        this.keepStartingHands();
        _.each(this.allPlayers, player => player.clickPrompt('Done'));
    }

    guardCurrentPhase(phase) {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    selectProvinces() {
        const provinceLocations = [
            'province 1',
            'province 2',
            'province 3',
            'province 4',
            'stronghold province'
        ];
        _.each(this.allPlayers, player => {
            _.each(provinceLocations, (loc) => {
                let card = player.player.provinceDeck.value()[0];
                player.dragCard(card, loc);
            });
            player.clickPrompt('Done');
        });
    }

    completeSetup() {
        this.guardCurrentPhase('setup');
        _.each(this.allPlayers, player => player.clickPrompt('Done'));
    }

    skipActionWindow() {
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Pass'));
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
        var promptedPlayer = this.getPromptedPlayer('Select first player');
        promptedPlayer.clickPrompt(player.name);
    }
}

module.exports = GameFlowWrapper;
