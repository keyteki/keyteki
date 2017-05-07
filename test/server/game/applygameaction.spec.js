/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const Game = require('../../../server/game/game.js');

describe('Game', function() {
    beforeEach(function() {
        this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        this.game = new Game('1', 'Test Game', { gameRepository: this.gameRepository });

        this.card1 = jasmine.createSpyObj('card', ['allowGameAction']);
        this.card2 = jasmine.createSpyObj('card', ['allowGameAction']);
        this.handler = jasmine.createSpy('handler');
    });

    describe('applyGameAction()', function() {
        describe('when passed a single card', function() {
            describe('and the action is allowed', function() {
                beforeEach(function() {
                    this.card1.allowGameAction.and.returnValue(true);

                    this.game.applyGameAction('kill', this.card1, this.handler);
                });

                it('should check that the action is allowed on the card', function() {
                    expect(this.card1.allowGameAction).toHaveBeenCalledWith('kill');
                });

                it('should call the handler callback with the card', function() {
                    expect(this.handler).toHaveBeenCalledWith(this.card1);
                });
            });

            describe('and the action is not allowed', function() {
                beforeEach(function() {
                    this.card1.allowGameAction.and.returnValue(false);

                    this.game.applyGameAction('kill', this.card1, this.handler);
                });

                it('should not call the handler callback', function() {
                    expect(this.handler).not.toHaveBeenCalled();
                });
            });
        });

        describe('when passed an array of cards', function() {
            describe('and the action is allowed for all cards', function() {
                beforeEach(function() {
                    this.card1.allowGameAction.and.returnValue(true);
                    this.card2.allowGameAction.and.returnValue(true);

                    this.game.applyGameAction('kill', [this.card1, this.card2], this.handler);
                });

                it('should check that the action is allowed on the cards', function() {
                    expect(this.card1.allowGameAction).toHaveBeenCalledWith('kill');
                    expect(this.card2.allowGameAction).toHaveBeenCalledWith('kill');
                });

                it('should call the handler callback with the cards', function() {
                    expect(this.handler).toHaveBeenCalledWith([this.card1, this.card2]);
                });
            });

            describe('and the action is not allowed on some of the cards', function() {
                beforeEach(function() {
                    this.card1.allowGameAction.and.returnValue(false);
                    this.card2.allowGameAction.and.returnValue(true);

                    this.game.applyGameAction('kill', [this.card1, this.card2], this.handler);
                });

                it('should call the handler callback with the allowed cards', function() {
                    expect(this.handler).toHaveBeenCalledWith([this.card2]);
                });
            });

            describe('and the action is not allowed on any of the cards', function() {
                beforeEach(function() {
                    this.card1.allowGameAction.and.returnValue(false);
                    this.card2.allowGameAction.and.returnValue(false);

                    this.game.applyGameAction('kill', [this.card1, this.card2], this.handler);
                });

                it('should not call the handler callback', function() {
                    expect(this.handler).not.toHaveBeenCalled();
                });
            });
        });
    });
});
