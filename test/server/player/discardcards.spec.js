const _ = require('underscore');

const Player = require('../../../server/game/player.js');

describe('Player', function () {

    function createCardSpy(num, owner) {
        let spy = jasmine.createSpyObj('card', ['moveTo', 'removeDuplicate']);
        spy.num = num;
        spy.location = 'loc';
        spy.dupes = _([]);
        spy.owner = owner;
        return spy;
    }

    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'raiseEvent', 'queueSimpleStep', 'addMessage']);
        this.gameSpy.applyGameAction.and.callFake((type, cards, handler) => {
            if(cards.length > 0) {
                handler(cards);
            }
        });

        this.player = new Player('1', 'Test 1', true, this.gameSpy);
        spyOn(this.player, 'moveCard');

        this.callbackSpy = jasmine.createSpy('callback');

        this.card1 = createCardSpy(1, this.player);
        this.card2 = createCardSpy(2, this.player);
    });

    describe('discardCards()', function () {
        describe('when no cards are passed', function() {
            beforeEach(function() {
                this.player.discardCards([], false, this.callbackSpy);
            });

            it('should not raise the event', function() {
                expect(this.gameSpy.raiseEvent).not.toHaveBeenCalled();
            });
        });

        describe('when cards are passed', function() {
            beforeEach(function() {
                this.eventOuterParams = { player: this.player, cards: [this.card1, this.card2], allowSave: false, originalLocation: 'loc' };
                this.player.discardCards([this.card1, this.card2], false, this.callbackSpy);
            });

            it('should raise the onCardsDiscarded event', function() {
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardsDiscarded', this.eventOuterParams, jasmine.any(Function));
            });

            describe('the onCardsDiscarded handler', function() {
                beforeEach(function() {
                    this.gameSpy.queueSimpleStep.and.callFake(callback => {
                        this.simpleStepCallback = callback;
                    });
                    this.eventInnerParams1 = { player: this.player, card: this.card1, allowSave: false, originalLocation: 'loc' };
                    this.eventInnerParams2 = { player: this.player, card: this.card2, allowSave: false, originalLocation: 'loc' };
                    this.onCardsDiscardedHandler = this.gameSpy.raiseEvent.calls.mostRecent().args[2];
                    this.onCardsDiscardedHandler(this.eventOuterParams);
                });

                it('should raise the onCardDiscarded event for each card', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardDiscarded', this.eventInnerParams1, jasmine.any(Function));
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardDiscarded', this.eventInnerParams2, jasmine.any(Function));
                });

                it('should queue a step to call the callback', function() {
                    expect(this.gameSpy.queueSimpleStep).toHaveBeenCalled();
                });

                describe('the simple step callback', function () {
                    it('should call the original callback', function() {
                        this.simpleStepCallback();
                        expect(this.callbackSpy).toHaveBeenCalledWith([this.card1,this.card2]);
                    });
                });

                describe('the onCardDiscarded handler', function() {
                    beforeEach(function() {
                        this.onCardDiscardedHandler = this.gameSpy.raiseEvent.calls.mostRecent().args[2];
                        this.onCardDiscardedHandler(this.eventInnerParams1);
                    });

                    it('should move the card to discard', function() {
                        expect(this.player.moveCard).toHaveBeenCalledWith(this.card1, 'conflict discard pile');
                    });
                });
            });
        });
    });

    describe('discardCard()', function () {
        describe('when the card has no dupes(needs better wording)', function() {
            beforeEach(function() {
                this.eventOuterParams = { player: this.player, cards: [this.card1], allowSave: false, originalLocation: 'loc' };
                this.player.discardCard(this.card1, false);
            });

            it('should raise the onCardsDiscarded event', function() {
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardsDiscarded', this.eventOuterParams, jasmine.any(Function));
            });

            describe('the onCardsDiscarded handler', function() {
                beforeEach(function() {
                    this.gameSpy.queueSimpleStep.and.callFake(callback => {
                        this.simpleStepCallback = callback;
                    });
                    this.eventInnerParams1 = { player: this.player, card: this.card1, allowSave: false, originalLocation: 'loc' };
                    this.onCardsDiscardedHandler = this.gameSpy.raiseEvent.calls.mostRecent().args[2];
                    this.onCardsDiscardedHandler(this.eventOuterParams);
                });

                it('should raise the onCardDiscarded event for each card', function() {
                    expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardDiscarded', this.eventInnerParams1, jasmine.any(Function));
                });

                describe('the onCardDiscarded handler', function() {
                    beforeEach(function() {
                        this.onCardDiscardedHandler = this.gameSpy.raiseEvent.calls.mostRecent().args[2];
                        this.onCardDiscardedHandler(this.eventInnerParams1);
                    });

                    it('should move the card to discard', function() {
                        expect(this.player.moveCard).toHaveBeenCalledWith(this.card1, 'conflict discard pile');
                    });
                });
            });
        });
    });
});
