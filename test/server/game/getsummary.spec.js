/*global describe, it, beforeEach, expect*/

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Spectator = require('../../../server/game/spectator.js');

describe('the Game', () => {
    var game = {};
    var player1 = new Player('1', 'Player 1', true);
    var player2 = new Player('2', 'Player 2', false);
    var spectator = new Spectator('3', 'Spectator 1');

    beforeEach(() => {
        game = new Game('1', 'Test Game');
    });

    describe('getSummary function', () => {
        describe('when there are no players', () => {
            it('should return basic empty state', () => {
                var state = game.getSummary('');

                expect(state.name).toBe('Test Game');
                expect(state.started).toBe(false);
                expect(state.players.length).toBe(0);
            });
        });

        describe('when a player joins', () => {
            beforeEach(() => {
                game.players[player1.id] = player1;
            });

            it('should return basic state for the player', () => {
                var state = game.getSummary('');

                expect(state.started).toBe(false);
                expect(state.players.length).toBe(1);
                expect(state.players[0].name).toBe(player1.name);
            });

            describe('and another player joins', () => {
                beforeEach(() => {
                    game.players[player2.id] = player2;
                });

                it('should return basic state for both players', () => {
                    var state = game.getSummary('');

                    expect(state.started).toBe(false);
                    expect(state.players.length).toBe(2);
                    expect(state.players[0].name).toBe(player1.name);
                    expect(state.players[1].name).toBe(player2.name);
                });
            });
        });

        describe('when a player has a deck selected', () => {
            beforeEach(() => {
                player1.deck = { name: 'Test Deck'};
                game.players[player1.id] = player1;
                game.players[player2.id] = player2;
            });

            describe('who is the current player', () => {
                it('should return a summary of their deck', () => {
                    var state = game.getSummary(player1.id);

                    expect(state.players[0].deck.name).toBe('Test Deck');
                });
            });

            describe('who is not the current player', () => {
                it('should show that the player has a deck but no details', () => {
                    var state = game.getSummary(player2.id);

                    expect(state.players[0].deck).not.toBe(undefined);
                    expect(state.players[0].deck.name).toBe(undefined);
                });
            });
        });

        describe('when there are spectators', () => {
            beforeEach(() => {
                game.players[player1.id] = player1;
                game.players[player2.id] = player2;
                game.players[spectator.id] = spectator;
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
