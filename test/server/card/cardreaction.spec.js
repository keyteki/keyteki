/*global describe, it, beforeEach, expect, jasmine */
/*eslint camelcase: 0, no-invalid-this: 0 */

const CardReaction = require('../../../server/game/cardreaction.js');
const Event = require('../../../server/game/event.js');

describe('CardReaction', function () {
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
            return new CardReaction(this.gameSpy, this.cardSpy, this.properties);
        };
    });

    describe('constructor', function() {
        describe('location', function() {
            it('should default to play area', function() {
                this.action = new CardReaction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('play area');
            });

            it('should default to province for cards with type province', function() {
                this.cardSpy.getType.and.returnValue('province');
                this.action = new CardReaction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('province');
            });

            it('should default to hand for cards with type event', function() {
                this.cardSpy.getType.and.returnValue('event');
                this.action = new CardReaction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('hand');
            });

            it('should use the location sent via properties', function() {
                this.properties.location = 'foo';
                this.action = new CardReaction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toBe('foo');
            });
        });
    });

    describe('eventHandler()', function() {
        beforeEach(function() {
            this.executeEventHandler = (...args) => {
                this.event = new Event('onSomething', args);
                this.reaction = new CardReaction(this.gameSpy, this.cardSpy, this.properties);
                this.reaction.eventHandler(this.event);
            };
        });

        it('should call the when handler with the appropriate arguments', function() {
            this.executeEventHandler(1, 2, 3);
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(this.event, 1, 2, 3);
        });

        describe('when in the setup phase', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'setup';
                this.executeEventHandler(1, 2, 3);
            });

            it('should not register the ability', function() {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the card has been blanked', function() {
            beforeEach(function() {
                this.cardSpy.isBlank.and.returnValue(true);
                this.executeEventHandler(1, 2, 3);
            });

            it('should not register the ability', function() {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
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

        describe('when the card is not in the proper location', function() {
            beforeEach(function() {
                this.cardSpy.location = 'foo';
                this.executeEventHandler(1, 2, 3);
            });

            it('should not register the ability', function() {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
            });

            describe('and the limit has been reached', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(true);
                    this.executeEventHandler(1, 2, 3);
                });

                it('should not register the ability', function() {
                    expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
                });
            });

            describe('and the limit has not been reached', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(false);
                    this.executeEventHandler(1, 2, 3);
                });

                it('should register the ability', function() {
                    expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(this.reaction, jasmine.any(Object));
                });
            });
        });

        describe('when the reaction has a cost', function() {
            beforeEach(function() {
                this.cost = jasmine.createSpyObj('cost', ['canPay']);
                this.properties.cost = this.cost;
            });

            describe('and the cost can be paid', function() {
                beforeEach(function() {
                    this.cost.canPay.and.returnValue(true);
                    this.executeEventHandler(1, 2, 3);
                });

                it('should register the ability', function() {
                    expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(this.reaction, jasmine.any(Object));
                });
            });

            describe('and the cost cannot be paid', function() {
                beforeEach(function() {
                    this.cost.canPay.and.returnValue(false);
                    this.executeEventHandler(1, 2, 3);
                });

                it('should not register the ability', function() {
                    expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.context = { context: 1 };
        });

        describe('with single choice reactions', function() {
            beforeEach(function() {
                this.properties = {
                    when: {
                        onSomething: () => true
                    },
                    handler: jasmine.createSpy('handler')
                };
                this.context.choice = 'default';
            });

            describe('when the choice is default', function () {
                beforeEach(function() {
                    this.reaction = this.createReaction();
                    this.context.choice = 'default';
                    this.reaction.executeHandler(this.context);
                });

                it('should call the handler', function() {
                    expect(this.properties.handler).toHaveBeenCalled();
                });
            });

            describe('when the choice is unconfigured', function() {
                beforeEach(function() {
                    this.reaction = this.createReaction();
                    this.context.choice = 'Win the game';
                    this.reaction.executeHandler(this.context);
                });

                it('should not call the handler', function() {
                    expect(this.properties.handler).not.toHaveBeenCalled();
                });
            });

            describe('when there is a limit', function() {
                beforeEach(function() {
                    this.properties.limit = this.limitSpy;
                    this.reaction = this.createReaction();
                });

                describe('and the handler returns a non-false value', function() {
                    beforeEach(function() {
                        this.properties.handler.and.returnValue(undefined);
                        this.reaction.executeHandler(this.context);
                    });

                    it('should increment the limit', function() {
                        expect(this.limitSpy.increment).toHaveBeenCalled();
                    });
                });

                describe('and the handler returns false', function() {
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

        describe('with multiple choice reactions', function() {
            beforeEach(function() {
                this.properties = {
                    when: {
                        onSomething: () => true
                    },
                    choices: {
                        'Foo': jasmine.createSpy('handler1'),
                        'Bar': jasmine.createSpy('handler2'),
                        'Baz': jasmine.createSpy('handler3')
                    }
                };
                this.context.choice = 'Baz';
            });

            describe('when the choice is an existing choice', function () {
                beforeEach(function() {
                    this.reaction = this.createReaction();
                    this.context.choice = 'Baz';
                    this.reaction.executeHandler(this.context);
                });

                it('should call the appropriate handler', function() {
                    expect(this.properties.choices['Foo']).not.toHaveBeenCalled();
                    expect(this.properties.choices['Bar']).not.toHaveBeenCalled();
                    expect(this.properties.choices['Baz']).toHaveBeenCalled();
                });
            });

            describe('when the choice is unconfigured', function() {
                beforeEach(function() {
                    this.reaction = this.createReaction();
                    this.context.choice = 'Win the game';
                    this.reaction.executeHandler(this.context);
                });

                it('should not call any of the handler', function() {
                    expect(this.properties.choices['Foo']).not.toHaveBeenCalled();
                    expect(this.properties.choices['Bar']).not.toHaveBeenCalled();
                    expect(this.properties.choices['Baz']).not.toHaveBeenCalled();
                });
            });

            describe('when there is a limit', function() {
                beforeEach(function() {
                    this.properties.limit = this.limitSpy;
                    this.reaction = this.createReaction();
                });

                describe('and the handler returns a non-false value', function() {
                    beforeEach(function() {
                        this.properties.choices['Baz'].and.returnValue(undefined);
                        this.reaction.executeHandler(this.context);
                    });

                    it('should increment the limit', function() {
                        expect(this.limitSpy.increment).toHaveBeenCalled();
                    });
                });

                describe('and the handler returns false', function() {
                    beforeEach(function() {
                        this.properties.choices['Baz'].and.returnValue(false);
                        this.reaction.executeHandler(this.context);
                    });

                    it('should not increment the limit', function() {
                        expect(this.limitSpy.increment).not.toHaveBeenCalled();
                    });
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
            expect(this.gameSpy.on).toHaveBeenCalledWith('onFoo:reaction', jasmine.any(Function));
            expect(this.gameSpy.on).toHaveBeenCalledWith('onBar:reaction', jasmine.any(Function));
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
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onFoo:reaction', jasmine.any(Function));
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onBar:reaction', jasmine.any(Function));
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
