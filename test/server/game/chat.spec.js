/*global describe, it, beforeEach, expect, spyOn*/

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Spectator = require('../../../server/game/spectator.js');

describe('the Game', function() {
    var game = {};
    var player1 = new Player('1', 'Player 1', true);
    var spectator = new Spectator('3', 'Spectator 1');

    beforeEach(function() {
        game = new Game('1', 'Test Game');

        game.players[player1.id] = player1;
        game.players[spectator.id] = spectator;

        game.initialise();

        player1.setPower = undefined;
    });

    describe('the chat() function', function() {
        describe('when called by a player not in the game', function() {
            it('should not add any chat messages', function() {
                game.chat('notinthegame', 'Test Message');

                expect(game.messages.length).toBe(0);
            });
        });

        describe('when called by a player in the game', function() {
            describe('with no slashes', function() {
                it('should add their chat message', function() {
                    game.chat(player1.id, 'Test Message');

                    expect(game.messages.length).toBe(1);
                    expect(game.messages[0].message[1].name).toBe(player1.name);
                    expect(game.messages[0].message.join('')).toContain('Test Message');
                });
            });

            describe('with a /power command', function() {
                describe('with no arguments', function() {
                    it('should prompt the user to change power to 1', function () {
                        game.chat(player1.id, '/power');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(1);
                    });
                });

                describe('with a string argument', function() {
                    it('should prompt the user to change power to 1', function () {
                        game.chat(player1.id, '/power test');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should prompt the user to change power to 1', function () {
                        game.chat(player1.id, '/power -1');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should prompt the user to change power to the argument', function () {
                        game.chat(player1.id, '/power 3');

                        expect(game.messages.length).toBe(0);
                        expect(player1.setPower).toBe(3);
                    });
                });

                describe('half way through a message', function() {
                    it('should not trigger the /power command', function() {
                        game.chat(player1.id, 'test test /power test');

                        expect(player1.setPower).toBe(undefined);
                    });
                });
            });

            describe('with a /draw command', function() {
                beforeEach(function() {
                    spyOn(player1, 'drawCardsToHand');
                });

                describe('with no arguments', function() {
                    it('should draw 1 card', function () {
                        game.chat(player1.id, '/draw');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a string argument', function() {
                    it('should draw 1 card', function () {
                        game.chat(player1.id, '/draw test');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should draw 1 card', function () {
                        game.chat(player1.id, '/draw -1');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should draw 4 cards', function () {
                        game.chat(player1.id, '/draw 4');

                        expect(game.messages.length).toBe(1);
                        expect(player1.drawCardsToHand).toHaveBeenCalledWith(4);
                    });
                });
            });

            describe('with a /discard command', function() {
                beforeEach(function() {
                    spyOn(player1, 'discardAtRandom');
                });

                describe('with no arguments', function() {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/discard');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a string argument', function() {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/discard test');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/discard -1');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should discard 3 cards', function () {
                        game.chat(player1.id, '/discard 3');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardAtRandom).toHaveBeenCalledWith(3);
                    });
                });
            });

            describe('with a /pillage command', function() {
                beforeEach(function() {
                    spyOn(player1, 'discardFromDraw');
                });

                describe('with no arguments', function() {
                    it('should discard 1 card', function () {
                        game.chat(player1.id, '/pillage');

                        expect(game.messages.length).toBe(1);
                        expect(player1.discardFromDraw).toHaveBeenCalledWith(1);
                    });
                });
            });

        });

        describe('when called by a spectator in the game', function() {
            describe('with no slashes', function () {
                it('should add their chat message', function() {
                    game.chat(spectator.id, 'Test Message');

                    expect(game.messages.length).toBe(1);
                    expect(game.messages[0].message[1].name).toBe(spectator.name);
                    expect(game.messages[0].message.join('')).toContain('Test Message');
                });
            });

            describe('with a /power command', function() {
                it('should add the message to the messages', function() {
                    game.chat(spectator.id, '/power');

                    expect(game.messages.length).toBe(1);
                    expect(player1.setPower).toBe(undefined);
                });
            });
        });
    });
});
