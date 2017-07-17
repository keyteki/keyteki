/*global describe, it, beforeEach, expect, jasmine */
/*eslint camelcase: 0, no-invalid-this: 0 */

const CardForcedReaction = require('../../../server/game/cardforcedreaction.js');
const Event = require('../../../server/game/event.js');

describe('CardForcedReaction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'registerAbility']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isBlank']);
        this.cardSpy.location = 'play area';
        this.limitSpy = jasmine.createSpyObj('limit', ['increment', 'isAtMax', 'registerEvents', 'unregisterEvents']);

        this.properties = {
            when: {
                onSomething: jasmine.createSpy('when condition')
            },
            handler: jasmine.createSpy('handler')
        };

        this.properties.when.onSomething.and.returnValue(true);

        this.createReaction = () => {
            return new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
        };
    });

    describe('eventHandler()', function() {
        beforeEach(function() {
            this.executeEventHandler = (...args) => {
                this.event = new Event('onSomething', args);
                this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
                this.reaction.eventHandler(this.event);
            };
        });

        it('should call the when handler with the appropriate arguments', function() {
            this.executeEventHandler(1, 2, 3);
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(this.event, 1, 2, 3);
        });

        describe('when the when condition returns false', function() {
            beforeEach(function() {
                this.properties.when.onSomething.and.returnValue(false);
                this.executeEventHandler(1, 2, 3);
            });

            it('should not register the ability', function() {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the when condition returns true', function() {
            beforeEach(function() {
                this.properties.when.onSomething.and.returnValue(true);
                this.executeEventHandler(1, 2, 3);
            });

            it('should register the ability', function() {
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(this.reaction, this.event);
            });
        });
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.meetsRequirements = () => {
                this.event = new Event('onSomething', [1, 2, 3]);
                this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
                this.context = this.reaction.createContext(this.event);
                return this.reaction.meetsRequirements(this.context);
            };
        });

        it('should call the when handler with the appropriate arguments', function() {
            this.meetsRequirements();
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(this.event, 1, 2, 3);
        });

        describe('when in the setup phase', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'setup';
            });

            it('should return false', function() {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the card has been blanked', function() {
            beforeEach(function() {
                this.cardSpy.isBlank.and.returnValue(true);
            });

            it('should return false', function() {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the when condition returns false', function() {
            beforeEach(function() {
                this.properties.when.onSomething.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the card is not in the proper location', function() {
            beforeEach(function() {
                this.cardSpy.location = 'foo';
            });

            it('should return false', function() {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
            });

            describe('and the limit has been reached', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(true);
                });

                it('should return false', function() {
                    expect(this.meetsRequirements()).toBe(false);
                });
            });

            describe('and the limit has not been reached', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(false);
                });

                it('should return true', function() {
                    expect(this.meetsRequirements()).toBe(true);
                });
            });
        });
    });

    describe('executeHandler', function() {
        beforeEach(function() {
            this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
            this.context = { context: 1 };
        });

        it('should execute the handler', function() {
            this.reaction.executeHandler(this.context);
            expect(this.properties.handler).toHaveBeenCalledWith(this.context);
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.reaction.limit = this.limitSpy;
            });

            describe('and the handler returns non-false', function() {
                beforeEach(function() {
                    this.properties.handler.and.returnValue(undefined);
                    this.reaction.executeHandler(this.context);
                });

                it('should increment the limit', function() {
                    expect(this.limitSpy.increment).toHaveBeenCalled();
                });
            });

            describe('and the handler returns explicitly false', function() {
                beforeEach(function() {
                    this.properties.handler.and.returnValue(false);
                    this.reaction.executeHandler(this.context);
                });

                it('should not increment the limit', function() {
                    expect(this.limitSpy.increment).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('registerEvents()', function() {
        beforeEach(function() {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true
                },
                handler: () => true
            };
            this.reaction = this.createReaction();
            this.reaction.registerEvents();
        });

        it('should register all when event handlers with the proper event type suffix', function() {
            expect(this.gameSpy.on).toHaveBeenCalledWith('onFoo:forcedreaction', jasmine.any(Function));
            expect(this.gameSpy.on).toHaveBeenCalledWith('onBar:forcedreaction', jasmine.any(Function));
        });

        it('should not reregister events already registered', function() {
            expect(this.gameSpy.on.calls.count()).toBe(2);
            this.reaction.registerEvents();
            expect(this.gameSpy.on.calls.count()).toBe(2);
        });
    });

    describe('unregisterEvents', function() {
        beforeEach(function() {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true
                },
                handler: () => true
            };
            this.reaction = this.createReaction();

        });

        it('should unregister all previously registered when event handlers', function() {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onFoo:forcedreaction', jasmine.any(Function));
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onBar:forcedreaction', jasmine.any(Function));
        });

        it('should not remove listeners when they have not been registered', function() {
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).not.toHaveBeenCalled();
        });

        it('should not unregister events already unregistered', function() {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.calls.count()).toBe(2);
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.calls.count()).toBe(2);
        });
    });
});
