const TriggeredAbility = require('../../../server/game/triggeredability.js');

describe('TriggeredAbility', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'registerAbility']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isBlank', 'canTriggerAbilities']);
        //this.cardSpy.location = 'play area';
        //this.cardSpy.canTriggerAbilities.and.returnValue(true);
        //this.cardSpy.abilities = { reactions: [] };
        //this.cardSpy.controller = { name: 'player1' };
        //this.limitSpy = jasmine.createSpyObj('limit', ['increment', 'isAtMax', 'registerEvents', 'unregisterEvents']);

        this.properties = {
            when: {
                onSomething: jasmine.createSpy('when condition')
            },
            handler: jasmine.createSpy('handler')
        };

        this.properties.when.onSomething.and.returnValue(true);

        this.reaction = new TriggeredAbility(this.gameSpy, this.cardSpy, 'reaction', this.properties);
    });

    describe('eventHandler()', function() {
        beforeEach(function() {
            this.executeEventHandler = () => {
                this.event = { name: 'onSomething' };
                this.window = jasmine.createSpyObj('window', ['addChoice']);
                this.reaction.eventHandler(this.event, this.window);
                this.context = this.reaction.createContext(this.event);
            };
        });

        it('should call the when handler with the appropriate arguments', function() {
            this.executeEventHandler();
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(this.event, this.context);
        });

        describe('when the when condition returns false', function() {
            beforeEach(function() {
                this.properties.when.onSomething.and.returnValue(false);
                this.executeEventHandler();
            });

            it('should not register the ability', function() {
                expect(this.window.addChoice).not.toHaveBeenCalled();
            });
        });

        describe('when the when condition returns true', function() {
            beforeEach(function() {
                this.spy1 = spyOn(this.reaction, 'meetsRequirements');
                this.spy1.and.returnValue('');
                this.spy2 = spyOn(this.reaction, 'isInValidLocation');
                this.spy2.and.returnValue(true);
                this.properties.when.onSomething.and.returnValue(true);
                this.executeEventHandler();
            });

            it('should register the ability', function() {
                expect(this.window.addChoice).toHaveBeenCalledWith(this.context);
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
            this.reaction = new TriggeredAbility(this.gameSpy, this.cardSpy, 'reaction', this.properties);
            this.reaction.registerEvents();
        });

        it('should register all when event handlers with the proper event type suffix', function() {
            expect(this.gameSpy.on).toHaveBeenCalledWith('onFoo:reaction', jasmine.any(Function));
            expect(this.gameSpy.on).toHaveBeenCalledWith('onBar:reaction', jasmine.any(Function));
        });

        it('should not reregister events already registered', function() {
            expect(this.gameSpy.on.calls.count()).toBe(4);
            this.reaction.registerEvents();
            expect(this.gameSpy.on.calls.count()).toBe(4);
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
            this.reaction = new TriggeredAbility(this.gameSpy, this.cardSpy, 'reaction', this.properties);

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
