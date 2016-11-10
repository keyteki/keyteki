/*global describe, it, beforeEach, expect, spyOn*/

const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');
const Spectator = require('../../server/game/spectator.js');

describe('the Game', () => {
    var game = {};
    var player1 = new Player('1', 'Player 1', true);
    var spectator = new Spectator('3', 'Spectator 1');

    beforeEach(() => {
        game = new Game('1', 'Test Game');

        game.players[player1.id] = player1;
        game.players[spectator.id] = spectator;

        game.initialise();

        player1.setPower = undefined;
    });

    describe('the chat() function', () => {
        describe('when called by a player not in the game', () => {
            it('should not add any chat messages', () => {
                game.chat('notinthegame', 'Test Message');

                expect(game.messages.length).toBe(0);
            });
        });

        describe('when called by a player in the game', () => {
            describe('with no slashes', () => {
                it('should add their chat message', () => {
                    game.chat(player1.id, 'Test Message');

                    expect(game.messages.length).toBe(1);
                    expect(game.messages[0].message.indexOf('Test Message')).not.toBe(-1);
                });
            });

            describe('with a /power command', () => {
                describe('with no arguments', () => {
                    it('should prompt the user to change power to 1', function () {
                        game.chat(player1.id, '/power');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(1);
                    });
                });

                describe('with a string argument', () => {
                    it('should prompt the user to change power to 1', function () {
                        game.chat(player1.id, '/power test');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(1);
                    });
                });

                describe('with a negative argument', () => {
                    it('should prompt the user to change power to 1', function () {
                        game.chat(player1.id, '/power -1');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(1);
                    });
                });

                describe('with a valid argument', () => {
                    it('should prompt the user to change power to the argument', function () {
                        game.chat(player1.id, '/power 3');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(3);
                    });
                });
            });

            describe('with a /draw command', () => {
                beforeEach(() => {
                    spyOn(player1, 'drawCardsToHand');
                });

                describe('with no arguments', () => {
                    it('should draw 1 card', function () {
                        game.chat(player1.id, '/draw');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a string argument', () => {
                    it('should draw 1 card', function () {
                        game.chat(player1.id, '/draw test');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a negative argument', () => {
                    it('should draw 1 card', function () {
                        game.chat(player1.id, '/draw -1');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a valid argument', () => {
                    it('should draw 4 cards', function () {
                        game.chat(player1.id, '/draw 4');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(4);
                    });
                });
            });

            describe('with a /discard command', () => {
                beforeEach(() => {
                    spyOn(player1, 'discardAtRandom');
                });

                describe('with no arguments', () => {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/discard');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a string argument', () => {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/discard test');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a negative argument', () => {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/discard -1');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a valid argument', () => {
                    it('should discard 3 cards', function () {
                        game.chat(player1.id, '/discard 3');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(3);
                    });
                });
            });

            describe('with a /pillage command', () => {
                beforeEach(() => {
                    spyOn(player1, 'discardFromDraw');
                });

                describe('with no arguments', () => {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/pillage');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardFromDraw).toHaveBeenCalledWith(1);
                    });
                });
            });

        });

        describe('when called by a spectator in the game', () => {
            describe('with no slashes', function () {
                it('should add their chat message', () => {
                    game.chat(player1.id, 'Test Message');

                    expect(game.messages.length).toBe(1);
                    expect(game.messages[0].message.indexOf('Test Message')).not.toBe(-1);
                });
            });

            describe('with a /power command', () => {
                it('should add the message to the messages', function() {
                    game.chat(spectator.id, '/power');

                    expect(game.messages.length).toBe(1);
                    expect(player1.setPower).toBe(undefined);
                });
            });
        });
    });
});
