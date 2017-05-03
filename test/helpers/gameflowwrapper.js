/* global jasmine */

const _ = require('underscore');

const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');

class GameFlowWrapper {
    constructor() {
        var gameRouter = jasmine.createSpyObj('gameRouter', ['gameWon', 'playerLeft']);
        var details = {
            name: 'player1\'s game',
            id: 12345,
            owner: 'player1',
            saveGameId: 12345,
            players: [
                { id: '111', user: { username: 'player1' } },
                { id: '222', user: { username: 'player2' } }
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

    completeSetup() {
        this.guardCurrentPhase('setup');
        _.each(this.allPlayers, player => player.clickPrompt('Done'));
    }

    completeMarshalPhase() {
        this.guardCurrentPhase('marshal');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    completeChallengesPhase() {
        this.guardCurrentPhase('challenge');
        // Each player clicks 'Done' when challenge initiation prompt shows up.
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    completeDominancePhase() {
        this.guardCurrentPhase('dominance');
    }

    completeTaxationPhase() {
        this.guardCurrentPhase('taxation');
        // TODO: Discard down to reserve in case of tests that fill up the player's hand
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('End Round'));
    }

    skipActionWindow() {
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
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

    selectPlotOrder(player) {
        let promptedPlayer = this.getPromptedPlayer('Choose when revealed order');
        let buttonText = player.name + ' - ' + player.activePlot.name;
        promptedPlayer.clickPrompt(buttonText);
    }

    unopposedChallenge(player, type, participant, reactionExpected) {
        var opponent = this.allPlayers.find(p => p !== player);

        player.clickPrompt(type);
        player.clickCard(participant, 'play area');
        player.clickPrompt('Done');

        this.skipActionWindow();

        opponent.clickPrompt('Done');

        this.skipActionWindow();

        if(!reactionExpected) {
            this.skipActionWindow();
        }
    }
}

module.exports = GameFlowWrapper;
