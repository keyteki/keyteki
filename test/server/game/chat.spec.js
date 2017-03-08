/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Spectator = require('../../../server/game/spectator.js');

describe('the Game', function() {
    beforeEach(function() {
        this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        this.game = new Game('1', 'Test Game', { gameRepository: this.gameRepository });

        this.player1 = new Player('1', { username: 'Player 1' }, true, this.game);
        this.spectator = new Spectator('3', { username: 'Spectator 1' }, this.game);

        this.game.playersAndSpectators[this.player1.id] = this.player1;
        this.game.playersAndSpectators[this.spectator.id] = this.spectator;

        this.game.initialise();

        this.chatCommands = this.game.chatCommands;
    });

    describe('the getNumberOrDefault() function', function() {
        describe('with no arguments', function() {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('', 1)).toBe(1);
            });
        });

        describe('with a string argument', function() {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('test', 1)).toBe(1);
            });
        });

        describe('with a negative argument', function() {
            it('should return the default', function () {
                expect(this.chatCommands.getNumberOrDefault('-1', 1)).toBe(1);
            });
        });

        describe('with a valid argument', function() {
            it('should return the parsed value', function () {
                expect(this.chatCommands.getNumberOrDefault('3', 1)).toBe(3);
            });
        });
    });

    describe('the chat() function', function() {
        describe('when called by a player not in the game', function() {
            it('should not add any chat messages', function() {
                this.game.chat('notinthegame', 'Test Message');

                expect(this.game.messages.length).toBe(0);
            });
        });

        describe('when called by a player in the game', function() {
            describe('with no slashes', function() {
                it('should add their chat message', function() {
                    this.game.chat(this.player1.name, 'Test Message');

                    expect(this.game.messages.length).toBe(1);
                    expect(this.game.messages[0].message[1].name).toBe(this.player1.name);
                    expect(this.game.messages[0].message.join('')).toContain('Test Message');
                });
            });

            describe('with a /draw command', function() {
                beforeEach(function() {
                    spyOn(this.player1, 'drawCardsToHand');
                });

                describe('with no arguments', function() {
                    it('should draw 1 card', function () {
                        this.game.chat(this.player1.name, '/draw');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a string argument', function() {
                    it('should draw 1 card', function () {
                        this.game.chat(this.player1.name, '/draw test');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should draw 1 card', function () {
                        this.game.chat(this.player1.name, '/draw -1');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should draw 4 cards', function () {
                        this.game.chat(this.player1.name, '/draw 4');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith(4);
                    });
                });

                describe('half way through a message', function() {
                    it('should not trigger the /draw command', function() {
                        this.game.chat(this.player1.name, 'test test /draw test');

                        expect(this.player1.drawCardsToHand).not.toHaveBeenCalled();
                    });
                });
            });

            describe('with a /discard command', function() {
                beforeEach(function() {
                    spyOn(this.player1, 'discardAtRandom');
                });

                describe('with no arguments', function() {
                    it('should discard 1 card', function () {
                        this.game.chat(this.player1.name, '/discard');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a string argument', function() {
                    it('should discard 1 card', function () {
                        this.game.chat(this.player1.name, '/discard test');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should discard 1 card', function () {
                        this.game.chat(this.player1.name, '/discard -1');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.discardAtRandom).toHaveBeenCalledWith(1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should discard 3 cards', function () {
                        this.game.chat(this.player1.name, '/discard 3');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.discardAtRandom).toHaveBeenCalledWith(3);
                    });
                });
            });

            describe('with a /pillage command', function() {
                beforeEach(function() {
                    spyOn(this.player1, 'discardFromDraw');
                });

                describe('with no arguments', function() {
                    it('should discard 1 card', function () {
                        this.game.chat(this.player1.name, '/pillage');

                        expect(this.player1.discardFromDraw).toHaveBeenCalledWith(1, jasmine.any(Function));
                    });
                });
            });

        });

        describe('when called by a spectator in the game', function() {
            describe('with no slashes', function () {
                it('should add their chat message', function() {
                    this.game.chat(this.spectator.name, 'Test Message');

                    expect(this.game.messages.length).toBe(1);
                    expect(this.game.messages[0].message[1].name).toBe(this.spectator.name);
                    expect(this.game.messages[0].message.join('')).toContain('Test Message');
                });
            });

            describe('with a /power command', function() {
                it('should add the message to the messages', function() {
                    this.game.chat(this.spectator.name, '/power');

                    expect(this.game.messages.length).toBe(1);
                    expect(this.player1.setPower).toBe(undefined);
                });
            });
        });
    });
});
