const EventWindow = require('../../../server/game/gamesteps/eventwindow.js');
const Event = require('../../../server/game/event.js');

xdescribe('EventWindow', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['emit', 'openAbilityWindow']);
        this.params = ['foo', 'bar'];
        this.handler = jasmine.createSpy('handler');
        this.eventWindow = new EventWindow(this.gameSpy, 'myevent', this.params, this.handler);
    });

    describe('continue()', function() {
        describe('during the normal flow', function() {
            beforeEach(function() {
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt/reaction events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.emit).toHaveBeenCalledWith('myevent', jasmine.any(Event), 'foo', 'bar');
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.any(Event) });
            });

            it('should call the handler', function() {
                expect(this.handler).toHaveBeenCalled();
            });
        });

        describe('when the event is cancelled', function() {
            beforeEach(function() {
                this.eventWindow.event.cancel();
            });

            it('should not emit the post-cancel interrupt/reaction events', function() {
                this.eventWindow.continue();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.emit).not.toHaveBeenCalledWith('myevent', jasmine.any(Event), jasmine.any(String), jasmine.any(String));
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.any(Event) });
            });

            it('should not call the handler', function() {
                this.eventWindow.continue();
                expect(this.handler).not.toHaveBeenCalled();
            });

            describe('and another step has been queued on the event', function() {
                beforeEach(function() {
                    this.anotherStep = jasmine.createSpyObj('step', ['continue']);
                    this.eventWindow.queueStep(this.anotherStep);
                });

                it('should still call the step', function() {
                    this.eventWindow.continue();
                    expect(this.anotherStep.continue).toHaveBeenCalled();
                });
            });
        });
        /*
        describe('when an event has its handler skipped', function() {
            beforeEach(function() {
                this.eventWindow.event.skipHandler();
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt/reaction events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.emit).toHaveBeenCalledWith('myevent', jasmine.any(Event), 'foo', 'bar');
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.any(Event) });
            });

            it('should not call the handler', function() {
                expect(this.handler).not.toHaveBeenCalled();
            });
        });
        */
        describe('when an event handler cancels the event', function() {
            beforeEach(function() {
                this.handler.and.callFake(event => event.cancel());
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.any(Event) });
            });

            it('should not emit the post-cancel  events', function() {
                expect(this.gameSpy.emit).not.toHaveBeenCalledWith('myevent', jasmine.any(Event), jasmine.any(String), jasmine.any(String));
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.any(Event) });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.any(Event) });
            });
        });
    });
});
