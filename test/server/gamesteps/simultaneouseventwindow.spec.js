/*global describe, it, beforeEach, expect, jasmine*/
/* eslint no-invalid-this: 0 */

const _ = require('underscore');

const SimultaneousEventWindow = require('../../../server/game/gamesteps/simultaneouseventwindow.js');
const Event = require('../../../server/game/event.js');

describe('SimultaneousEventWindow', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['emit', 'openAbilityWindow', 'queueSimpleStep']);
        this.gameSpy.queueSimpleStep.and.callFake(step => step());
        this.card1 = { uuid: '1111', name: 'card1' };
        this.card2 = { uuid: '2222', name: 'card2' };
        this.cards = [this.card1, this.card2];
        this.params = { foo: 'bar' };
        this.handler = jasmine.createSpy('handler');
        this.perCardHandler = jasmine.createSpy('perCardHandler');
        this.eventWindow = new SimultaneousEventWindow(this.gameSpy, this.cards, {
            eventName: 'myevent',
            params: this.params,
            handler: this.handler,
            perCardEventName: 'percardevent',
            perCardHandler: this.perCardHandler
        });
    });

    describe('continue()', function() {
        describe('during the normal flow', function() {
            beforeEach(function() {
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt/reaction events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.emit).toHaveBeenCalledWith('myevent', jasmine.any(Event), { cards: this.cards, foo: 'bar' });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
            });

            it('should call the handler', function() {
                expect(this.handler).toHaveBeenCalled();
            });

            it('should emit all of the interrupt/reaction events for each card', function() {
                _.each(this.cards, card => {
                    expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                    expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                    expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                    expect(this.gameSpy.emit).toHaveBeenCalledWith('percardevent', jasmine.any(Event), { card: card, foo: 'bar' });
                    expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                    expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                });
            });

            it('should call the handlers for each card', function() {
                expect(this.perCardHandler).toHaveBeenCalledWith(jasmine.objectContaining({ card: this.card1 }), jasmine.any(Object));
                expect(this.perCardHandler).toHaveBeenCalledWith(jasmine.objectContaining({ card: this.card2 }), jasmine.any(Object));
            });
        });

        describe('when the handler reorders cards', function() {
            beforeEach(function() {
                // reorder cards during the event handler
                this.handler.and.callFake(event => {
                    event.cards = [this.card2, this.card1];
                });

                this.perCardOrder = [];
                this.perCardHandler.and.callFake(event => {
                    this.perCardOrder.push(event.card);
                });

                this.eventWindow.continue();
            });

            it('should call per-card handlers in the new order', function() {
                expect(this.perCardOrder).toEqual([this.card2, this.card1]);
            });
        });

        describe('when the event is cancelled', function() {
            beforeEach(function() {
                this.eventWindow.event.cancel();
            });

            it('should not emit the post-cancel interrupt/reaction events', function() {
                this.eventWindow.continue();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.emit).not.toHaveBeenCalledWith('myevent', jasmine.any(Event), jasmine.any(Object));
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
            });

            it('should not call the handler', function() {
                this.eventWindow.continue();
                expect(this.handler).not.toHaveBeenCalled();
            });

            it('should not emit all of the interrupt/reaction events for each card', function() {
                this.eventWindow.continue();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith(jasmine.objectContaining({ event: jasmine.objectContaining({ name: 'percardevent' }) }));
                expect(this.gameSpy.emit).not.toHaveBeenCalledWith('percardevent', jasmine.any(Event), jasmine.any(Object));
            });

            it('should not call the handlers for each card', function() {
                expect(this.perCardHandler).not.toHaveBeenCalled();
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

        describe('when an event has its handler skipped', function() {
            beforeEach(function() {
                this.eventWindow.event.skipHandler();
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt/reaction events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.emit).toHaveBeenCalledWith('myevent', jasmine.any(Event), { cards: this.cards, foo: 'bar' });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
            });

            it('should not call the handler', function() {
                expect(this.handler).not.toHaveBeenCalled();
            });
        });

        describe('when an event handler cancels the event', function() {
            beforeEach(function() {
                this.handler.and.callFake(event => event.cancel());
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
            });

            it('should not emit the post-cancel events', function() {
                expect(this.gameSpy.emit).not.toHaveBeenCalledWith('myevent', jasmine.any(Event), jasmine.any(Object));
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.objectContaining({ name: 'myevent', cards: this.cards }) });
            });
        });

        describe('when an individual card event is cancelled', function() {
            beforeEach(function() {
                this.eventWindow.perCardEventMap[this.card1.uuid].cancel();
                this.eventWindow.continue();
            });

            it('should not emit the interrupt/reaction events for the cancelled card', function() {
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith(jasmine.objectContaining({ event: jasmine.objectContaining({ name: 'percardevent', card: this.card1 }) }));
            });

            it('should emit all of the interrupt/reaction events for the non-cancelled cards', function() {
                let card = this.card2;
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                expect(this.gameSpy.emit).toHaveBeenCalledWith('percardevent', jasmine.any(Event), { card: card, foo: 'bar' });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: jasmine.objectContaining({ name: 'percardevent', card: card }) });
            });
        });
    });
});
