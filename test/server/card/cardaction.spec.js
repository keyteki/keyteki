/*global describe, it, beforeEach, expect, jasmine, spyOn */
/*eslint camelcase: 0, no-invalid-this: 0 */

const CardAction = require('../../../server/game/cardaction.js');

describe('CardAction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener']);
        this.gameSpy.currentPhase = 'marshal';

        this.cardSpy = jasmine.createSpyObj('card', ['isBlank']);
        this.cardSpy.handler = function() {};
        spyOn(this.cardSpy, 'handler').and.returnValue(true);

        this.limitSpy = jasmine.createSpyObj('limit', ['increment', 'isAtMax', 'registerEvents', 'unregisterEvents']);

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
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the use count has reached the limit', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(true);

                    this.action.execute(this.player, 'arg');
                });

                it('should not call the handler', function() {
                    expect(this.cardSpy.handler).not.toHaveBeenCalled();
                });

                it('should not count towards the limit', function() {
                    expect(this.limitSpy.increment).not.toHaveBeenCalled();
                });
            });

            describe('and the use count is below the limit', function() {
                describe('and the handler returns false', function() {
                    beforeEach(function() {
                        this.cardSpy.handler.and.returnValue(false);

                        this.action.execute(this.player, 'arg');
                    });

                    it('should call the handler', function() {
                        expect(this.cardSpy.handler).toHaveBeenCalledWith(this.player, 'arg');
                    });

                    it('should not count towards the limit', function() {
                        expect(this.limitSpy.increment).not.toHaveBeenCalled();
                    });
                });

                describe('and the handler returns undefined or a non-false value', function() {
                    beforeEach(function() {
                        this.cardSpy.handler.and.returnValue(undefined);

                        this.action.execute(this.player, 'arg');
                    });

                    it('should call the handler', function() {
                        expect(this.cardSpy.handler).toHaveBeenCalledWith(this.player, 'arg');
                    });

                    it('should count towards the limit', function() {
                        expect(this.limitSpy.increment).toHaveBeenCalled();
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
                expect(this.limitSpy.registerEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should register events for the limit', function() {
                expect(this.limitSpy.registerEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    describe('unregisterEvents()', function() {
        describe('when there is no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);

                this.action.unregisterEvents();
            });

            it('should not unregister an event', function() {
                expect(this.limitSpy.unregisterEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);

                this.action.unregisterEvents();
            });

            it('should unregister events for the limit', function() {
                expect(this.limitSpy.unregisterEvents).toHaveBeenCalledWith(this.gameSpy);
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
});
