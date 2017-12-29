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
        this.selectFirstPlayer(this.player1);
        this.selectProvinces();
        this.completeSetup();            
        this.guardCurrentPhase('dynasty');
    }

    guardCurrentPhase(phase) {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    selectProvinces() {
        _.each(this.allPlayers, player => {
            player.player.provinceDeck.first().selected = true;
            player.clickPrompt('Done');
        });
    }

    completeSetup() {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
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
        var promptedPlayer = this.getPromptedPlayer('You won the flip. Do you want to be:');
        if(player === promptedPlayer) {
            promptedPlayer.clickPrompt('First Player');
        } else {
            promptedPlayer.clickPrompt('Second Player');
        }
    }
}

module.exports = GameFlowWrapper;
