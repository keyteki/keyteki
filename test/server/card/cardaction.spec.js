/*global describe, it, beforeEach, expect, jasmine, spyOn */
/*eslint camelcase: 0, no-invalid-this: 0 */

const EventEmitter = require('events');

const CardAction = require('../../../server/game/cardaction.js');

describe('CardAction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener']);
        this.gameSpy.currentPhase = 'marshal';

        this.cardSpy = jasmine.createSpyObj('card', ['isBlank']);
        this.cardSpy.handler = function() {};
        spyOn(this.cardSpy, 'handler').and.returnValue(true);

        this.properties = {
            title: 'Do the thing',
            method: 'handler'
        };
    });

    describe('execute()', function() {
        beforeEach(function() {
            this.player = {};
            this.cardSpy.controller = this.player;
        });

        describe('when the action has limited uses', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 2,
                    period: 'round'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the use count has reached the limit', function() {
                beforeEach(function() {
                    // Use twice
                    this.action.execute(this.player, 'arg');
                    this.action.execute(this.player, 'arg');

                    this.cardSpy.handler.calls.reset();

                    this.action.execute(this.player, 'arg');
                });

                it('should not call the handler', function() {
                    expect(this.cardSpy.handler).not.toHaveBeenCalled();
                });
            });

            describe('and the use count is below the limit', function() {
                describe('and the handler returns false', function() {
                    beforeEach(function() {
                        this.cardSpy.handler.and.returnValue(false);

                        // Theoretically reach the limit
                        this.action.execute(this.player, 'arg');
                        this.action.execute(this.player, 'arg');

                        // Call past the limit
                        this.action.execute(this.player, 'arg');
                    });

                    it('should call the handler', function() {
                        expect(this.cardSpy.handler).toHaveBeenCalledWith(this.player, 'arg');
                    });

                    it('should not count towards the limit', function() {
                        expect(this.cardSpy.handler.calls.count()).toBe(3);
                    });
                });

                describe('and the handler returns undefined or a non-false value', function() {
                    beforeEach(function() {
                        this.cardSpy.handler.and.returnValue(undefined);

                        // Theoretically reach the limit
                        this.action.execute(this.player, 'arg');
                        this.action.execute(this.player, 'arg');

                        // Call past the limit
                        this.action.execute(this.player, 'arg');
                    });

                    it('should call the handler', function() {
                        expect(this.cardSpy.handler).toHaveBeenCalledWith(this.player, 'arg');
                    });

                    it('should count towards the limit', function() {
                        expect(this.cardSpy.handler.calls.count()).toBe(2);
                    });
                });
            });
        });

        describe('when executed with a player other than the card controller', function() {
            beforeEach(function() {
                this.otherPlayer = {};
            });

            describe('and the anyPlayer property is not set', function() {
                beforeEach(function() {
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should not call the handler', function() {
                    expect(this.cardSpy.handler).not.toHaveBeenCalled();
                });
            });

            describe('and the anyPlayer property is set', function() {
                beforeEach(function() {
                    this.properties.anyPlayer = true;
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should call the handler', function() {
                    expect(this.cardSpy.handler).toHaveBeenCalledWith(this.otherPlayer, 'arg');
                });
            });
        });

        describe('when the card is blank', function() {
            beforeEach(function() {
                this.cardSpy.isBlank.and.returnValue(true);
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not call the handler', function() {
                expect(this.cardSpy.handler).not.toHaveBeenCalled();
            });
        });

        describe('when only allowed in a certain phase', function() {
            beforeEach(function() {
                this.properties.phase = 'challenge';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and it is not that phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'dominance';
                    this.action.execute(this.player, 'arg');
                });

                it('should not call the handler', function() {
                    expect(this.cardSpy.handler).not.toHaveBeenCalled();
                });
            });

            describe('and it is the phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'challenge';
                    this.action.execute(this.player, 'arg');
                });

                it('should call the handler', function() {
                    expect(this.cardSpy.handler).toHaveBeenCalledWith(this.player, 'arg');
                });
            });
        });

        describe('when the current phase is setup', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'setup';
                this.properties.phase = 'any';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not call the handler', function() {
                expect(this.cardSpy.handler).not.toHaveBeenCalled();
            });
        });

        describe('when all conditions met', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should call the handler', function() {
                expect(this.cardSpy.handler).toHaveBeenCalledWith(this.player, 'arg');
            });
        });
    });

    describe('registerEvents()', function() {
        describe('when there is no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should not register an event', function() {
                expect(this.gameSpy.on).not.toHaveBeenCalled();
            });
        });

        describe('when the period is challenge', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'challenge'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should register a listener for the onChallengeFinished event', function() {
                expect(this.gameSpy.on).toHaveBeenCalledWith('onChallengeFinished', jasmine.any(Function));
            });
        });

        describe('when the period is phase', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'phase'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should register a listener for the onPhaseEnded event', function() {
                expect(this.gameSpy.on).toHaveBeenCalledWith('onPhaseEnded', jasmine.any(Function));
            });
        });

        describe('when the period is round', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'round'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should register a listener for the onRoundEnded event', function() {
                expect(this.gameSpy.on).toHaveBeenCalledWith('onRoundEnded', jasmine.any(Function));
            });
        });
    });

    describe('unregisterEvents()', function() {
        describe('when there is no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();

                this.action.unregisterEvents();
            });

            it('should not remove a listener', function() {
                expect(this.gameSpy.removeListener).not.toHaveBeenCalled();
            });
        });

        describe('when the period is challenge', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'challenge'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();

                this.action.unregisterEvents();
            });

            it('should remove a listener for the onChallengeFinished event', function() {
                expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onChallengeFinished', jasmine.any(Function));
            });
        });

        describe('when the period is phase', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'phase'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();

                this.action.unregisterEvents();
            });

            it('should remove a listener for the onPhaseEnded event', function() {
                expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onPhaseEnded', jasmine.any(Function));
            });
        });

        describe('when the period is round', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'round'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
                this.action.unregisterEvents();
            });

            it('should remove a listener for the onRoundEnded event', function() {
                expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onRoundEnded', jasmine.any(Function));
            });
        });

        describe('when unregistering multiple times', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'round'
                };
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
                this.action.unregisterEvents();

                this.action.unregisterEvents();
            });

            it('should only remove the listener once', function() {
                expect(this.gameSpy.removeListener.calls.count()).toBe(1);
            });
        });
    });

    describe('getMenuItem()', function() {
        beforeEach(function() {
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.menuItem = this.action.getMenuItem();
        });

        it('returns the menu item format', function() {
            expect(this.menuItem).toEqual({ text: 'Do the thing', method: 'doAction', anyPlayer: false });
        });
    });

    describe('resetting the use count', function() {
        beforeEach(function() {
            this.game = new EventEmitter();
            this.game.currentPhase = 'marshal';
        });

        describe('when the period is challenge', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'challenge'
                };
                this.action = new CardAction(this.game, this.cardSpy, this.properties);
                this.action.registerEvents();
                this.action.execute(this.player, 'arg');
                this.cardSpy.handler.calls.reset();
            });

            it('should reset on challenge end', function() {
                this.game.emit('onChallengeFinished');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(1);
            });

            it('should not reset on phase end', function() {
                this.game.emit('onPhaseEnded');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(0);
            });

            it('should not reset on round end', function() {
                this.game.emit('onRoundEnded');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(0);
            });
        });

        describe('when the period is phase', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'phase'
                };
                this.action = new CardAction(this.game, this.cardSpy, this.properties);
                this.action.registerEvents();
                this.action.execute(this.player, 'arg');
                this.cardSpy.handler.calls.reset();
            });

            it('should not reset on challenge end', function() {
                this.game.emit('onChallengeFinished');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(0);
            });

            it('should reset on phase end', function() {
                this.game.emit('onPhaseEnded');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(1);
            });

            it('should not reset on round end', function() {
                this.game.emit('onRoundEnded');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(0);
            });
        });

        describe('when the period is round', function() {
            beforeEach(function() {
                this.properties.limit = {
                    amount: 1,
                    period: 'round'
                };
                this.action = new CardAction(this.game, this.cardSpy, this.properties);
                this.action.registerEvents();
                this.action.execute(this.player, 'arg');
                this.cardSpy.handler.calls.reset();
            });

            it('should not reset on challenge end', function() {
                this.game.emit('onChallengeFinished');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(0);
            });

            it('should not reset on phase end', function() {
                this.game.emit('onPhaseEnded');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(0);
            });

            it('should reset on round end', function() {
                this.game.emit('onRoundEnded');
                this.action.execute(this.player, 'arg');
                expect(this.cardSpy.handler.calls.count()).toBe(1);
            });
        });
    });
});
