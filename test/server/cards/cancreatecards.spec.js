const _ = require('underscore');

const cards = require('../../../server/game/cards');
const AbilityDsl = require('../../../server/game/abilitydsl');
const eventNames = [
    'onCardAddFate',
    'onCardRemoveFate',
    'onFateTransfered',
    'onBeginRound',
    'onCardEntersPlay',
    'onCardTakenControl',
    'onCardAbilityInitiated',
    'onCardAbilityTriggered',
    'onSelectRingWithFate',
    'onConflictDeclared',
    'onProvinceRevealed',
    'onDefendersDeclared',
    'afterConflict',
    'onBreakProvince',
    'onResolveRingEffects',
    'onClaimRing',
    'onReturnHome',
    'onParticipantsReturnHome',
    'onConflictFinished',
    'onConflictPass',
    'onDetermineImperialFavor',
    'onFavorGloryTied',
    'onPlaceFateOnUnclaimedRings',
    'onHonorDialsRevealed',
    'onPhaseStarted',
    'onPhaseEnded',
    'onReadyAllCards',
    'onReturnRing',
    'onPassFirstPlayer',
    'onRoundEnded',
    'onDecksPrepared',
    'onCardsDrawn',
    'onIncomeCollected',
    'onCardAttached',
    'onCardSacrificed',
    'onCardPlaced',
    'onCardHonored',
    'onCardDishonored',
    'onCardBowed',
    'onCardReadied',
    'onDiscardFromHand',
    'onCardsDiscardedFromHand',
    'onCardLeavesPlay',
    'onMoveToConflict',
    'onMoveCharactersToConflict',
    'onSendHome',
    'onSendCharactersHome',
    'onCardPlayed',
    'onDeckShuffled',
    'onDuelResolution',
    'onDynastyCardTurnedFaceup',
    'onHonorTradedAfterBid',
    'onFirstPassDuringDynasty'
];

describe('All Cards:', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage', 'addEffect']);
        this.playerSpy = jasmine.createSpyObj('player', ['registerAbilityMax']);
        this.playerSpy.game = this.gameSpy;
    });

    _.each(cards, cardClass => {
        it('should be able to create \'' + cardClass.name + '\' and set it up', function() {
            // No explicit assertion - if this throws an exception it will fail
            // and give us a better stacktrace than the expect().not.toThrow()
            // assertion.
            new cardClass(this.playerSpy, {});
        });

        describe('Actions for \'' + cardClass.name + '\'', function() {
            beforeEach(function() {
                this.card = new cardClass(this.playerSpy, {});
                this.actionSpy = spyOn(this.card, 'action');
                this.card.setupCardAbilities(AbilityDsl);
                this.calls = _.flatten(this.actionSpy.calls.allArgs());
            });
            
            it('should have a title which is a string', function() {
                expect(_.all(this.calls, args => _.isString(args.title))).toBe(true);
            });

            it('should have a handler', function() {
                expect(_.all(this.calls, args => _.isFunction(args.handler))).toBe(true);
            });

            it('should have no condition or its condition should be a function', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.condition) || _.isFunction(args.condition))).toBe(true);
            });

            it('should have no phase or a legal phase as its phase', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.phase) || ['any', 'dynasty', 'draw', 'conflict', 'fate', 'regroup'].includes(args.phase))).toBe(true);
            });

            it('should have a legal location as its location', function() {
                expect(_.all(this.calls, args => (
                    _.isUndefined(args.location) || 
                    ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(args.location) ||
                    _.every(args.location, location => ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(location))
                ))).toBe(true);
            });

            it('should not have a when property', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.when))).toBe(true);
            });
        });

        describe('Reactions and Interrupts for \'' + cardClass.name + '\'', function() {
            beforeEach(function() {
                this.card = new cardClass(this.playerSpy, {});
                this.forcedReactionSpy = spyOn(this.card, 'forcedReaction');
                this.reactionSpy = spyOn(this.card, 'reaction');
                this.forcedInterruptSpy = spyOn(this.card, 'forcedInterrupt');
                this.interruptSpy = spyOn(this.card, 'interrupt');
                this.card.setupCardAbilities(AbilityDsl);
                this.calls = this.forcedReactionSpy.calls.allArgs();
                this.calls = this.calls.concat(this.reactionSpy.calls.allArgs());
                this.calls = this.calls.concat(this.forcedInterruptSpy.calls.allArgs());
                this.calls = this.calls.concat(this.interruptSpy.calls.allArgs());
                this.calls = _.flatten(this.calls);
            });
            
            it('should have a title which is a string', function() {
                expect(_.all(this.calls, args => _.isString(args.title))).toBe(true);
            });

            it('should have a handler which is a function', function() {
                expect(_.all(this.calls, args => _.isFunction(args.handler))).toBe(true);
            });

            it('should have not have a phase', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.phase))).toBe(true);
            });

            it('should have not have a condition', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.condition))).toBe(true);
            });

            it('should have at least one when property', function() {
                expect(_.all(this.calls, args => _.keys(args.when).length > 0)).toBe(true);
            });

            it('should have a legal events as keys in its when properties', function() {
                expect(_.all(this.calls, args => _.difference(_.keys(args.when), eventNames).length === 0)).toBe(true);
            });

            it('should have a function as the value for its when properties', function() {
                expect(_.all(this.calls, args => _.all(args.when, when => _.isFunction(when)))).toBe(true);
            });

            it('should have a legal location as its location', function() {
                expect(_.all(this.calls, args => (
                    _.isUndefined(args.location) || 
                    ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(args.location) ||
                    _.every(args.location, location => ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(location))
                ))).toBe(true);
            });
        });    
    });
});
