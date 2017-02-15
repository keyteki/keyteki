/*global describe, it, beforeEach, expect, jasmine*/

const _ = require('underscore');

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Spectator = require('../../../server/game/spectator.js');

describe('the Game', () => {
    var game = {};
    var player1 = new Player('1', { username: 'Player 1' }, true, game);
    var player2 = new Player('2', { username: 'Player 2' }, false, game);
    var spectator = new Spectator('3', 'Spectator 1');

    beforeEach(() => {
        var gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        game = new Game('1', { name: 'Test Game' }, { gameRepository: gameRepository });
    });

    describe('getSummary function', () => {
        describe('when there are no players', () => {
            it('should return basic empty state', () => {
                var state = game.getSummary('');

                expect(state.name).toBe('Test Game');
                expect(state.started).toBe(false);
                expect(_.size(state.players)).toBe(0);
            });
        });

        describe('when a player joins', () => {
            beforeEach(() => {
                game.playersAndSpectators[player1.name] = player1;
            });

            it('should return basic state for the player', () => {
                var state = game.getSummary('');

                expect(state.started).toBe(false);
                expect(_.size(state.players)).toBe(1);
                expect(state.players[player1.name].name).toBe(player1.name);
            });

            describe('and another player joins', () => {
                beforeEach(() => {
                    game.playersAndSpectators[player2.name] = player2;
                });

                it('should return basic state for both players', () => {
                    var state = game.getSummary('');

                    expect(state.started).toBe(false);
                    expect(_.size(state.players)).toBe(2);
                    expect(state.players[player1.name].name).toBe(player1.name);
                    expect(state.players[player2.name].name).toBe(player2.name);
                });
            });
        });

        describe('when a player has a deck selected', () => {
            beforeEach(() => {
                player1.deck = { name: 'Test Deck'};
                game.playersAndSpectators[player1.name] = player1;
                game.playersAndSpectators[player2.name] = player2;
            });

            describe('who is the current player', () => {
                it('should return a summary of their deck', () => {
                    var state = game.getSummary(player1.name);

                    expect(state.players[player1.name].deck.name).toBe('Test Deck');
                });
            });

            describe('who is not the current player', () => {
                it('should show that the player has a deck but no details', () => {
                    var state = game.getSummary(player2.name);

                    expect(state.players[player1.name].deck).not.toBe(undefined);
                    expect(state.players[player2.name].deck.name).toBe(undefined);
                });
            });
        });

        describe('when there are spectators', () => {
            beforeEach(() => {
                game.playersAndSpectators[player1.name] = player1;
                game.playersAndSpectators[player2.name] = player2;
                game.playersAndSpectators[spectator.name] = spectator;
            });

            it('should show the specators to any player', () => {
                var state = game.getSummary('any');

                expect(state.spectators).not.toBe(undefined);
                expect(state.spectators.length).toBe(1);
                expect(state.spectators[0].name).toBe(spectator.name);
            });
        });
    });
});
